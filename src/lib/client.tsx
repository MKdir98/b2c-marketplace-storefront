// Replace Algolia with Elasticsearch API client
import { createSearchClient } from './elasticsearch-client'

// Create the search client that calls our backend API
export const client = createSearchClient()
