import { listRegions } from "../data/regions"

export const checkRegion = async (locale: string) => {
  // In development, allow access to both supported locales
  if (process.env.NODE_ENV === 'development') {
    return ['ir', 'en'].includes(locale)
  }

  try {
    const regions = await listRegions()
    
    // If no regions are returned (backend down), allow development locales
    if (!regions || regions.length === 0) {
      return ['ir', 'en'].includes(locale)
    }
    
    const countries = regions
      ?.map((r) => {
        return r.countries?.map((c) => c.iso_2)
      })
      .flat()

    // Check if locale exists in countries, or allow supported development locales
    return countries.includes(locale) || ['ir', 'en'].includes(locale)
  } catch (error) {
    // If backend is not available, allow access for supported locales
    console.warn('Backend connection failed, allowing access for supported locales:', error)
    return ['ir', 'en'].includes(locale)
  }
}
