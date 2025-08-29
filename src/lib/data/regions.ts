"use server"

import { sdk } from "../config"
import medusaError from "@/lib/helpers/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Utility function to add timeout to fetch requests
const fetchWithTimeout = async <T>(
  url: string,
  options: any,
  timeoutMs: number = 3000
): Promise<T> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const result = await sdk.client.fetch<T>(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return result
  } catch (error) {
    clearTimeout(timeoutId)
    if (controller.signal.aborted) {
      throw new Error(`Request timeout after ${timeoutMs}ms`)
    }
    throw error
  }
}

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  try {
    return await fetchWithTimeout<{ regions: HttpTypes.StoreRegion[] }>(
      `/store/regions`,
      {
        method: "GET",
        next,
        cache: "no-cache",
      },
      3000 // 3 second timeout
    ).then(({ regions }) => regions)
  } catch (error) {
    console.warn('Failed to fetch regions, returning empty array for development:', error)
    return []
  }
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  try {
    return await fetchWithTimeout<{ region: HttpTypes.StoreRegion }>(
      `/store/regions/${id}`,
      {
        method: "GET",
        next,
        cache: "no-cache",
      },
      3000 // 3 second timeout
    ).then(({ region }) => region)
  } catch (error) {
    console.warn(`Failed to fetch region ${id}:`, error)
    return null
  }
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    return null
  }
}
