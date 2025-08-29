import { CartItems, CartSummary } from "@/components/organisms"
import { retrieveCart } from "@/lib/data/cart"
import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const Cart = async () => {
  const cart = await retrieveCart()

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <CartItems cart={cart} showSellerHeader={false} />
      </div>
      <div className="w-full max-w-md mt-6">
        <div className="border rounded-sm p-4 h-fit">
          <CartSummary
            item_total={cart?.item_subtotal || 0}
            shipping_total={0}
            total={cart?.total || 0}
            currency_code={cart?.currency_code || ""}
            tax={0}
            show_delivery={false}
            show_tax={false}
            labels={{ items: "اقلام", total: "جمع کل" }}
          />
          <LocalizedClientLink href="/checkout?step=address">
            <Button className="w-full py-3 flex justify-center items-center">
              ادامه خرید
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
