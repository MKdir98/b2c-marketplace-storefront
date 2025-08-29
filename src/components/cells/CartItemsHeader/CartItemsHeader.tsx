import { SingleProductSeller } from "@/types/product"
import { SellerAvatar } from "../SellerAvatar/SellerAvatar"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const CartItemsHeader = ({
  seller,
}: {
  seller: SingleProductSeller
}) => {
  return (
    <LocalizedClientLink href={`/sellers/${seller.handle}`}>
      <div className="border rounded-sm p-4 flex gap-4 items-center">
        <SellerAvatar photo={seller.photo} size={32} alt={seller.name} />

        <div className="lg:flex gap-2">
          <p className="uppercase heading-xs">{seller.name}</p>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
