"use client"
import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/atoms"

// Dynamically import map components to avoid SSR issues
const Map = dynamic(() => import("./Map"), { ssr: false })

interface AddressData {
  address_1: string
  city: string
  postal_code: string
  province?: string
  country_code: string
  latitude: number
  longitude: number
}

interface AddressMapSelectorProps {
  onAddressSelect: (address: AddressData) => void
  initialPosition?: { lat: number; lng: number }
  className?: string
}

// Reverse geocoding function using Nominatim (free alternative)
async function reverseGeocode(lat: number, lng: number): Promise<AddressData | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
    )
    const data = await response.json()
    
    if (data && data.address) {
      const address = data.address
      return {
        address_1: `${address.house_number || ""} ${address.road || address.street || ""}`.trim() || data.display_name.split(",")[0],
        city: address.city || address.town || address.village || address.municipality || "",
        postal_code: address.postcode || "",
        province: address.state || address.province || "",
        country_code: address.country_code?.toUpperCase() || "US",
        latitude: lat,
        longitude: lng,
      }
    }
    return null
  } catch (error) {
    console.error("Reverse geocoding failed:", error)
    return null
  }
}

export const AddressMapSelector: React.FC<AddressMapSelectorProps> = ({
  onAddressSelect,
  initialPosition = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  className = "",
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(initialPosition)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.warn("Geolocation failed:", error)
          // Keep default location
        }
      )
    }
  }, [])

  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true)
    const addressData = await reverseGeocode(lat, lng)
    if (addressData) {
      setSelectedAddress(addressData)
    }
    setIsLoading(false)
  }, [])

  const handleConfirmAddress = () => {
    if (selectedAddress) {
      onAddressSelect(selectedAddress)
    }
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setPosition({ lat: latitude, lng: longitude })
          setUserLocation({ lat: latitude, lng: longitude })
          handleLocationSelect(latitude, longitude)
        },
        (error) => {
          console.error("Failed to get current location:", error)
        }
      )
    }
  }

  if (typeof window === "undefined") {
    return <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select your location on the map</h3>
        <Button 
          type="button" 
          variant="filled" 
          onClick={handleCurrentLocation}
          className="text-sm"
        >
          Use Current Location
        </Button>
      </div>
      
      <div className="h-96 w-full rounded-lg overflow-hidden border">
        <Map
          center={userLocation}
          position={position}
          onLocationSelect={handleLocationSelect}
          onPositionChange={setPosition}
        />
      </div>

      {isLoading && (
        <div className="text-center text-gray-600">
          Looking up address...
        </div>
      )}

      {selectedAddress && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Selected Address:</h4>
          <div className="space-y-1 text-sm">
            <p>{selectedAddress.address_1}</p>
            <p>{selectedAddress.city}, {selectedAddress.province} {selectedAddress.postal_code}</p>
            <p>{selectedAddress.country_code}</p>
            <p className="text-gray-600">
              Coordinates: {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
            </p>
          </div>
          <Button 
            type="button"
            onClick={handleConfirmAddress}
            className="mt-3 w-full"
          >
            Use This Address
          </Button>
        </div>
      )}

      <p className="text-sm text-gray-600">
        Click on the map to select your exact location. We&apos;ll automatically fill in the address details.
      </p>
    </div>
  )
} 