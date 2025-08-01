// Elasticsearch API Client - calls backend instead of direct connection
export interface SearchParams {
  query?: string
  filters?: string
  category_id?: string
  collection_id?: string
  seller_handle?: string
  locale?: string
  page?: number
  limit?: number
  min_price?: number
  max_price?: number
  sort_by?: string
  facets?: string
}

export interface SearchResponse {
  products: any[]
  facets: Record<string, any>
  pagination: {
    page: number
    limit: number
    total_pages: number
  }
  total: number
  processing_time: number
}

class ElasticsearchAPIClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  async search(params: SearchParams): Promise<SearchResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })

    const response = await fetch(`${this.baseUrl}/store/search?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Alternative method for compatibility with existing Algolia-like calls
  async searchProducts(indexName: string, searchParams: any) {
    const params: SearchParams = {
      query: searchParams.query || '',
      filters: searchParams.filters || '',
      page: searchParams.page || 1,
      limit: searchParams.hitsPerPage || 20,
      ...searchParams
    }

    return this.search(params)
  }
}

// Export singleton instance
export const elasticsearchClient = new ElasticsearchAPIClient()

// Compatible SearchClient interface for React InstantSearch
export const createSearchClient = () => {
  const searchMethod = async (requests: any[]) => {
    try {
      const results = await Promise.all(
        requests.map(async ({ indexName, params }) => {
          const result = await elasticsearchClient.searchProducts(indexName, params)
          
          // Transform to Algolia-compatible format
          return {
            hits: result.products,
            nbHits: result.total,
            page: params.page || 0, // Algolia uses 0-based pages
            nbPages: result.pagination.total_pages,
            hitsPerPage: params.hitsPerPage || result.pagination.limit,
            processingTimeMS: result.processing_time,
            facets: result.facets || {},
            query: params.query || '',
            params: params,
            index: indexName,
            exhaustiveNbHits: true,
            exhaustiveFacetsCount: true
          }
        })
      )
      
      return { results }
    } catch (error) {
      console.error('Search error:', error)
      // Return empty results on error to prevent crashes
      return {
        results: requests.map(({ indexName, params }) => ({
          hits: [],
          nbHits: 0,
          page: params.page || 0,
          nbPages: 0,
          hitsPerPage: params.hitsPerPage || 20,
          processingTimeMS: 0,
          facets: {},
          query: params.query || '',
          params: params,
          index: indexName,
          exhaustiveNbHits: true,
          exhaustiveFacetsCount: true
        }))
      }
    }
  }

  return {
    // Main search method that InstantSearch expects
    search: searchMethod,

    // Additional methods that some InstantSearch components might expect
    searchForFacetValues: async () => {
      // Placeholder - implement if needed for autocomplete facet search
      return { facetHits: [], exhaustiveFacetsCount: true, processingTimeMS: 0 }
    },

    // Method for getting multiple queries (used by some advanced components)
    multipleQueries: async (queries: any[]) => {
      return searchMethod(queries)
    },

    // Clear cache method (optional)
    clearCache: () => {
      // No-op for our implementation
    },

    // Add user agent for debugging
    addAlgoliaAgent: () => {
      // No-op for our implementation  
    }
  }
} 