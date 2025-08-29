import {
  CartItemsHeader,
  CartItemsProducts,
} from "@/components/cells"
import { HttpTypes } from "@medusajs/types"

export const CartItems = ({ cart, showSellerHeader = true }: { cart: HttpTypes.StoreCart | null, showSellerHeader?: boolean }) => {
  if (!cart) return null

  const groupedItems: any = groupItemsBySeller(cart)

  return Object.keys(groupedItems).map((key) => (
    <div key={key} className="mb-4">
      {showSellerHeader && (
      <CartItemsHeader seller={groupedItems[key]?.seller} />
      )}
      <CartItemsProducts
        products={groupedItems[key].items || []}
        currency_code={cart.currency_code}
      />
      {/* Delivery footer hidden intentionally */}
    </div>
  ))
}

function groupItemsBySeller(cart: HttpTypes.StoreCart) {
  const groupedBySeller: any = {}

  cart.items?.forEach((item: any) => {
    const seller = item.product?.seller
    if (seller) {
      if (!groupedBySeller[seller.id]) {
        groupedBySeller[seller.id] = {
          seller: seller,
          items: [],
        }
      }
      groupedBySeller[seller.id].items.push(item)
    } else {
      if (!groupedBySeller["fleek"]) {
        groupedBySeller["fleek"] = {
          seller: {
            name: "Fleek",
            id: "fleek",
            photo: "/Logo.svg",
            created_at: new Date(),
          },
          items: [],
        }
      }
      groupedBySeller["fleek"].items.push(item)
    }
  })

  return groupedBySeller
}
