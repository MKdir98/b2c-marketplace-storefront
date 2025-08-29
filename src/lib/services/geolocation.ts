export interface GeolocationCoordinates {
  latitude: number
  longitude: number
}

export interface AddressWithCoordinates {
  address_1: string
  city: string
  postal_code: string
  province?: string
  country_code: string
  latitude: number
  longitude: number
}

export interface DeliveryEstimate {
  estimatedDeliveryTime: string
  deliveryDistance: number
  isWithinDeliveryZone: boolean
}

/**
 * Get user's current location using browser geolocation API
 */
export const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        let errorMessage = "Failed to get location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  })
}

/**
 * Reverse geocode coordinates to get address information
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<AddressWithCoordinates | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`
    )
    
    if (!response.ok) {
      throw new Error("Reverse geocoding request failed")
    }

    const data = await response.json()
    
    if (data && data.address) {
      const address = data.address
      return {
        address_1: `${address.house_number || ""} ${address.road || address.street || ""}`.trim() || 
                   data.display_name.split(",")[0],
        city: address.city || address.town || address.village || address.municipality || "",
        postal_code: address.postcode || "",
        province: address.state || address.province || "",
        country_code: address.country_code?.toUpperCase() || "US",
        latitude,
        longitude,
      }
    }
    return null
  } catch (error) {
    console.error("Reverse geocoding failed:", error)
    return null
  }
}

/**
 * Forward geocode address to get coordinates
 */
export const forwardGeocode = async (address: string): Promise<GeolocationCoordinates | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error("Forward geocoding request failed")
    }

    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      }
    }
    return null
  } catch (error) {
    console.error("Forward geocoding failed:", error)
    return null
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  coord1: GeolocationCoordinates,
  coord2: GeolocationCoordinates
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude)
  const dLon = toRadians(coord2.longitude - coord1.longitude)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180
}

/**
 * Estimate delivery time and cost based on distance from seller/warehouse
 */
export const estimateDelivery = (
  customerCoords: GeolocationCoordinates,
  sellerCoords: GeolocationCoordinates,
  maxDeliveryDistance: number = 50 // km
): DeliveryEstimate => {
  const distance = calculateDistance(customerCoords, sellerCoords)
  const isWithinDeliveryZone = distance <= maxDeliveryDistance
  
  let estimatedDeliveryTime = "N/A"
  
  if (isWithinDeliveryZone) {
    if (distance <= 5) {
      estimatedDeliveryTime = "1-2 hours"
    } else if (distance <= 15) {
      estimatedDeliveryTime = "2-4 hours"
    } else if (distance <= 30) {
      estimatedDeliveryTime = "Same day"
    } else {
      estimatedDeliveryTime = "1-2 days"
    }
  }
  
  return {
    estimatedDeliveryTime,
    deliveryDistance: Math.round(distance * 100) / 100, // Round to 2 decimal places
    isWithinDeliveryZone,
  }
}

/**
 * Get delivery phone number based on customer location
 * This would typically integrate with your delivery partner's API
 */
export const getDeliveryPhoneNumber = async (
  customerCoords: GeolocationCoordinates,
  deliveryZone?: string
): Promise<string> => {
  // This is a placeholder - in a real implementation, you would:
  // 1. Determine which delivery zone the customer is in
  // 2. Return the appropriate delivery partner's phone number
  // 3. Integrate with your delivery partner's API
  
  // For now, return a default number based on basic location logic
  // In a real app, this would be much more sophisticated
  return "+1-800-DELIVERY" // Placeholder
}

/**
 * Validate if coordinates are within valid ranges
 */
export const validateCoordinates = (coords: GeolocationCoordinates): boolean => {
  return (
    coords.latitude >= -90 &&
    coords.latitude <= 90 &&
    coords.longitude >= -180 &&
    coords.longitude <= 180
  )
} 