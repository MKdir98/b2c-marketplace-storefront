const PRODUCT_METAFIELDS=`
  metafields(
    identifiers: [
      {namespace: "rothys", key: "badges"},
      {namespace: "rothys", key: "launched_at"},
      {namespace: "rothys", key: "product_fit_tip"},
      {namespace: "rothys", key: "estimated_ship_date"},
      {namespace: "rothys", key: "preorder_backorder_experience"},
      {namespace: "rothys", key: "special_message"},
      {namespace: "rothys", key: "special_message_color_override"},
      {namespace: "rothys", key: "add_on_pdp_block_title"},
      {namespace: "rothys", key: "maximum_order_quantity"}
      {namespace: "rothys", key: "return_rules"},
      {namespace: "rothys", key: "add_on_pdp_show_hide"},
      {namespace: "rothys", key: "product_spotlight"},
      {namespace: "espresso", key: "best_selling_30_days"},
      {namespace: "espresso", key: "sales_velocity_7_days"},
    ]
  ) {
    reference {
      ... on MediaImage {
        image {
          originalSrc
        }
      }
    }
    value
    key
    namespace
  }
`,COLLECTION_METAFIELDS=`
  metafields(
    identifiers: []
  ) {
    reference {
      ... on MediaImage {
        image {
          originalSrc
        }
      }
      ... on GenericFile {
        url
      }
    }
    value
    key
    namespace
  }
`,VARIANT_METAFIELDS=`
  metafields(
    identifiers: [
      {namespace: "rothys", key: "estimated_ship_date"},
      {namespace: "rothys", key: "preorder_backorder_experience"},
      {namespace: "rothys", key: "active"}
    ]
  ) {
    reference {
      ... on MediaImage {
        image {
          originalSrc
        }
      }
    }
    value
    key
    namespace
  }
`,VARIANT_FIELDS=`
  id
  title
  priceV2 {
    amount
    currencyCode
  }
  compareAtPriceV2 {
    amount
    currencyCode
  }
  availableForSale
  selectedOptions {
    name
    value
  }
  sku
  image {
    url
    altText
  }
  ${VARIANT_METAFIELDS}
`,PRODUCT_FIELDS=`
  availableForSale
  id
  title
  descriptionHtml
  handle
  priceRange {
    minVariantPrice {
      amount
    }
    maxVariantPrice {
      amount
    }
  }
  productType
  vendor
  createdAt
  updatedAt
  publishedAt
  onlineStoreUrl
  tags
  media(first: 10) {
    edges {
      node {
        mediaContentType
        alt
        ...mediaFieldsByType
      }
    }
  }
  options {
    id
    name
    values
  }
  seo {
    title
  }
  collections(first: 250) {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
  ${PRODUCT_METAFIELDS}
`,PRODUCT_OPTION_FIELDS=`
  availableForSale
  id
  title
  descriptionHtml
  handle
  priceRange {
    minVariantPrice {
      amount
    }
    maxVariantPrice {
      amount
    }
  }
  productType
  vendor
  createdAt
  updatedAt
  publishedAt
  onlineStoreUrl
  tags
  media(first: 10) {
    edges {
      node {
        mediaContentType
        alt
        ...mediaFieldsByType
      }
    }
  }
  options {
    id
    name
    optionValues {
      id
      name
      firstSelectableVariant {
        availableForSale
        title
        id
        sku
        price {
          amount
        }
        compareAtPrice {
          amount
        }
        product {
          id
          title
          onlineStoreUrl
          handle
          tags
          metafields(
            identifiers: [
              {namespace: "rothys", key: "estimated_ship_date"},
              {namespace: "rothys", key: "preorder_backorder_experience"},
              {namespace: "rothys", key: "maximum_order_quantity"}   
              {namespace: "rothys", key: "return_rules"},
              {namespace: "rothys", key: "product_fit_tip"},
            ]
          ) {
            value
            key
            namespace
            reference {
              ... on Metaobject {
                handle
              }
            }
          }
          media(first: 10) {
          edges {
            node {
              mediaContentType
              alt
              ...mediaFieldsByType
            }
          }
          }
        }
      }
    }
  }
  ${PRODUCT_METAFIELDS}
`,MEDIA_FRAGMENT=`
  fragment mediaFieldsByType on Media {
    ... on ExternalVideo {
      id
      embeddedUrl
    }
    ... on MediaImage {
      alt
      image {
        url
      }
    }
    ... on Model3d {
      sources {
        url
        mimeType
        format
        filesize
      }
    }
    ... on Video {
      alt
      previewImage {
        url
      }
      sources {
        url
        mimeType
        format
        height
        width
      }
    }
  }
`,COLLECTION_FIELDS=`
  id
  title
  handle
  description
  updatedAt
  image {
    src
    altText
  }
  ${COLLECTION_METAFIELDS}
`;export const GetProductByHandle=`
  query GetProductByHandle($handle: String) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
      variants(first: 250) {
        edges {
          node {
            ${VARIANT_FIELDS}
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,GetProductById=`
  query GetProductById($id: ID!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    node(id: $id) {
      ... on Product {
        ${PRODUCT_FIELDS}
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,GetProductOptionsById=`
  query GetProductById($id: ID!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    node(id: $id) {
      ... on Product {
        ${PRODUCT_OPTION_FIELDS}
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,GetProductByIdDeferred=`
  query GetProductById($id: ID!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    node(id: $id) {
      ... on Product {
        handle
        ... @defer(label: "deferredFields") {
          title
          description
          variants(first: 250) {
            edges {
              node {
                ${VARIANT_FIELDS}
              }
            }
          }
          collections(first: 250) {
            edges {
              node {
                ${COLLECTION_FIELDS}
              }
            }
          }
        }
      }
    }
  }
`,GetProductVariantsByBatch=`
  query GetProductsByBatch($ids: [ID!]!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        variants(first: 250) {
          edges {
            node {
              ${VARIANT_FIELDS}
            }
          }
        }
      }
    }
  }
`,GetProductsByBatch=`
  query GetProductsByBatch($ids: [ID!]!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    nodes(ids: $ids) {
      ... on Product {
        ${PRODUCT_FIELDS}
        variants(first: 250) {
          edges {
            node {
              ${VARIANT_FIELDS}
            }
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,GetProductsByCollectionId=`
  query GetProductsByCollectionId($id: ID!, $limit: Int = 250, $afterCursor: String) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    node(id: $id) {
      ... on Collection {
        products(first: $limit, after: $afterCursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              title
              priceRange {
                minVariantPrice {
                  amount
                }
                maxVariantPrice {
                  amount
                }
              }
              productType
              vendor
              createdAt
              updatedAt
              publishedAt
              tags
              options {
                id
                name
                values
              }
              metafields(
                identifiers: [
                  {namespace: "style_group", key: "collection"},
                  {namespace: "swatch", key: "image"}
                ]
              ) {
                reference {
                  ... on MediaImage {
                    image {
                      originalSrc
                    }
                  }
                }
                value
                key
                namespace
              }
            }
          }
        }
      }
    }
  }
`,GetCollectionById=`
  query GetCollectionById($id: ID!, $limit: Int = 250, $afterCursor: String) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    node(id: $id) {
      ... on Collection {
        ${COLLECTION_FIELDS}
        products(first: $limit, after: $afterCursor) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              ${PRODUCT_FIELDS}
              variants(first: 250) {
                edges {
                  node {
                    ${VARIANT_FIELDS}
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,GetVariantById=`
  query GetVariantById($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        ${VARIANT_FIELDS}
      }
    }
  }
`,GetCollectionsByBatch=`
  query GetCollectionsByBatch($ids: [ID!]!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    nodes(ids: $ids) {
      ... on Collection {
        ${COLLECTION_FIELDS}
        products(first: 250) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              ${PRODUCT_FIELDS}
              variants(first: 250) {
                edges {
                  node {
                    ${VARIANT_FIELDS}
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,GetCollectionsByTitles=`
  query GetCollectionsByTitles($titlesQuery: String!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    collections(first: 10, query: $titlesQuery) {
      edges {
        node {
          ${COLLECTION_FIELDS}
          products(first: 250) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
              node {
                ${PRODUCT_FIELDS}
                variants(first: 250) {
                  edges {
                    node {
                      ${VARIANT_FIELDS}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,SearchProducts=`
  query SearchProducts($query: String!, $limit: Int = 250, $afterCursor: String) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    products(first: $limit, after: $afterCursor, query: $query) {
      edges {
        node {
          ${PRODUCT_FIELDS}
          variants(first: 250) {
            edges {
              node {
                ${VARIANT_FIELDS}
              }
            }
          }
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
`,GetAllMetaobjects=`
  query GetAllMetaobjects($type: String!) @inContext(country: ${Shopify.country}, language: ${Shopify.locale.replace("-","_").toUpperCase()}) {
    metaobjects(type: $type, first: 100) {
      edges {
        node {
          id
          handle
          type
          updatedAt
          onlineStoreUrl
          fields {
            key
            value
            reference {
              __typename
              ... on MediaImage {
                id
                mediaContentType
                image {
                  id
                  url
                  altText
                }
              }
              ... on GenericFile {
                id
                url
              }
            }
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
//# sourceMappingURL=/cdn/shop/t/1137/assets/lib-queries.js.map?v=79940345896037252991756319544
