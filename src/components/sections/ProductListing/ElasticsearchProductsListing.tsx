"use client"

import { HttpTypes } from "@medusajs/types"
import {
  ProductCard,
  ProductListingActiveFilters,
  ProductsPagination,
  ProductSidebar,
} from "@/components/organisms"
import { useSearchParams, useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { PRODUCT_LIMIT } from "@/const"
import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { useEffect, useState } from "react"
import { listProducts } from "@/lib/data/products"
import { getProductPrice } from "@/lib/helpers/get-product-price"

interface SearchResults {
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

// Helper function to get translations with fallback
const useTranslationsWithFallback = (locale?: string) => {
  try {
    const t = useTranslations('common')
    return {
      noResults: t('noResults'),
      noResultsDescription: t('noResultsDescription'),
      listings: t('listings')
    }
  } catch (error) {
    // Fallback translations based on locale
    if (locale === 'ir') {
      return {
        noResults: 'نتیجه‌ای یافت نشد',
        noResultsDescription: 'متأسفانه هیچ محصولی با معیارهای شما پیدا نشد',
        listings: 'آگهی'
      }
    }
    return {
      noResults: 'No results',
      noResultsDescription: 'Sorry, we can\'t find any results for your criteria',
      listings: 'listings'
    }
  }
}

export const ElasticsearchProductsListing = ({
  category_id,
  collection_id,
  seller_handle,
  locale = process.env.NEXT_PUBLIC_DEFAULT_REGION,
  hideFilters = false,
}: {
  category_id?: string
  collection_id?: string
  locale?: string
  seller_handle?: string
  currency_code?: string
  hideFilters?: boolean
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const translations = useTranslationsWithFallback(locale)
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [products, setProducts] = useState<HttpTypes.StoreProduct[] | null>(null)
  const [loading, setLoading] = useState(true)

  const query = searchParams.get("query") || ""
  const page = parseInt(searchParams.get("page") || "1")

  // Build search parameters
  const buildSearchParams = () => {
    const params = new URLSearchParams()
    
    if (query) params.append("query", query)
    if (category_id) params.append("category_id", category_id)
    if (collection_id) params.append("collection_id", collection_id)
    if (seller_handle) params.append("seller_handle", seller_handle)
    if (locale) params.append("locale", locale)
    
    params.append("page", page.toString())
    params.append("limit", PRODUCT_LIMIT.toString())

    // Add filter parameters
    const minPrice = searchParams.get("min_price")
    const maxPrice = searchParams.get("max_price")
    if (minPrice) params.append("min_price", minPrice)
    if (maxPrice) params.append("max_price", maxPrice)

    // Add other filters
    const color = searchParams.get("color")
    const size = searchParams.get("size")
    const condition = searchParams.get("condition")
    if (color) params.append("color", color)
    if (size) params.append("size", size)
    if (condition) params.append("condition", condition)

    return params
  }

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const searchParamsString = buildSearchParams().toString()
        const response = await fetch(`/api/store/search?${searchParamsString}`)
        
        if (response.ok) {
          const results = await response.json()
          setSearchResults(results)
        } else {
          console.error('Search API error:', response.statusText)
          // Fallback to empty results
          setSearchResults({
            products: [],
            facets: {},
            pagination: { page: 1, limit: PRODUCT_LIMIT, total_pages: 0 },
            total: 0,
            processing_time: 0
          })
        }
      } catch (error) {
        console.error('Search fetch error:', error)
        setSearchResults({
          products: [],
          facets: {},
          pagination: { page: 1, limit: PRODUCT_LIMIT, total_pages: 0 },
          total: 0,
          processing_time: 0
        })
      }
      setLoading(false)
    }

    fetchResults()
  }, [searchParams, category_id, collection_id, seller_handle, locale])

  // Fetch full product details for matching products
  useEffect(() => {
    if (!searchResults || !searchResults.products.length) {
      setProducts([])
      return
    }

    const fetchProductDetails = async () => {
      try {
        const { response } = await listProducts({
          countryCode: locale,
          queryParams: {
            fields: "*variants.calculated_price,*seller.reviews,-thumbnail,-images,-type,-tags,-variants.options,-options,-collection,-collection_id",
            limit: 999,
          },
        })

        const filteredProducts = response.products.filter((prod) => {
          const { cheapestPrice } = getProductPrice({ product: prod })
          return Boolean(cheapestPrice) && 
                 searchResults.products.some((searchProd) => searchProd.id === prod.id)
        })

        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error fetching product details:', error)
        setProducts([])
      }
    }

    fetchProductDetails()
  }, [searchResults, locale])

  if (loading || !searchResults) {
    return <ProductListingSkeleton />
  }

  const count = searchResults.total
  const pages = searchResults.pagination.total_pages

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <div className="my-4 label-md">
          {count} {translations.listings}
        </div>
      </div>
      {!hideFilters && (
      <div className="hidden md:block">
        <ProductListingActiveFilters />
      </div>
      )}
      <div className="md:flex gap-4">
        {!hideFilters && (
        <div>
          <ProductSidebar />
        </div>
        )}
        <div className="w-full">
          {!searchResults.products.length ? (
            <div className="text-center w-full my-10">
              <h2 className="uppercase text-primary heading-lg">
                {translations.noResults}
              </h2>
              <p className="mt-4 text-lg">
                {translations.noResultsDescription}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <ul className="flex flex-wrap gap-4">
                {searchResults.products.map((hit) => {
                  const productDetail = products?.find((p) => p.id === hit.id)
                  if (!productDetail) return null
                  
                  return (
                    <ProductCard
                      api_product={productDetail}
                      key={hit.id}
                      product={hit}
                    />
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ProductsPagination pages={pages} />
    </>
  )
} 