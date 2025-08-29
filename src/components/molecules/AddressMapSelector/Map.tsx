"use client"
import { useEffect, useRef } from "react"
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet"

interface MapProps {
  center: { lat: number; lng: number }
  position: { lat: number; lng: number } | null
  onLocationSelect: (lat: number, lng: number) => void
  onPositionChange: (position: { lat: number; lng: number }) => void
}

const Map: React.FC<MapProps> = ({ center, position, onLocationSelect, onPositionChange }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        // Dynamically import Leaflet
        const L = await import("leaflet")

        // Import Leaflet CSS
        const leafletCSS = document.createElement("link")
        leafletCSS.rel = "stylesheet"
        leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(leafletCSS)

        // Fix default markers issue in Leaflet with bundlers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        // Create map
        const map = L.map(mapRef.current).setView([center.lat, center.lng], 13)
        mapInstanceRef.current = map

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Handle map clicks
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng
          onPositionChange({ lat, lng })
          onLocationSelect(lat, lng)

          // Remove existing marker
          if (markerRef.current) {
            map.removeLayer(markerRef.current)
          }

          // Add new marker
          const newMarker = L.marker([lat, lng]).addTo(map)
          markerRef.current = newMarker
        })

        // Add initial marker if position exists
        if (position) {
          const initialMarker = L.marker([position.lat, position.lng]).addTo(map)
          markerRef.current = initialMarker
        }
      } catch (error) {
        console.error("Failed to initialize map:", error)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center.lat, center.lng, onLocationSelect, onPositionChange, position])

  // Update marker position when position prop changes
  useEffect(() => {
    if (position && markerRef.current) {
      markerRef.current.setLatLng([position.lat, position.lng])
    }
  }, [position])

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
}

export default Map 