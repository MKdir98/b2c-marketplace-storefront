"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { setShippingMethod } from "@/lib/data/cart"
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment"
import { convertToLocale } from "@/lib/helpers/money"
import { CheckCircleSolid, ChevronUpDown, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx, Heading, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import { Button } from "@/components/atoms"
import { Modal, SelectField } from "@/components/molecules"
import { CartShippingMethodRow } from "./CartShippingMethodRow"
import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"

// Extended cart item product type to include seller
type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  seller?: {
    id: string
    name: string
  }
}

// Cart item type definition
type CartItem = {
  product?: ExtendedStoreProduct
  // Include other cart item properties as needed
}

export type StoreCardShippingMethod = HttpTypes.StoreCartShippingOption & {
  seller_id?: string
  service_zone?: {
    fulfillment_set: {
      type: string
    }
  }
}

type ShippingProps = {
  cart: Omit<HttpTypes.StoreCart, "items"> & {
    items?: CartItem[]
  }
  availableShippingMethods:
    | (StoreCardShippingMethod &
        { rules: any; seller_id: string; price_type: string; id: string }[])
    | null
  // New embedding props
  embedded?: boolean
  hideHeader?: boolean
  showAsCards?: boolean
  showContinue?: boolean
  selectedId?: string | null
  onSelectedChange?: (id: string | null) => void
}

const CartShippingMethodsSection: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
  embedded = false,
  hideHeader = false,
  showAsCards = false,
  showContinue = true,
  selectedId,
  onSelectedChange,
}) => {
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [missingModal, setMissingModal] = useState(false)
  const [missingShippingSellers, setMissingShippingSellers] = useState<
    string[]
  >([])

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isQueryOpen = searchParams.get("step") === "delivery"
  const isOpen = embedded ? true : isQueryOpen

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) =>
      sm.rules?.find((rule: any) => rule.attribute === "is_return")?.value !==
      "true"
  )

  useEffect(() => {
    const set = new Set<string>()
    cart.items?.forEach((item) => {
      if (item?.product?.seller?.id) {
        set.add(item.product.seller.id)
      }
    })

    const sellerMethods = _shippingMethods?.map(({ seller_id }) => seller_id)

    const missingSellerIds = [...set].filter(
      (sellerId) => !sellerMethods?.includes(sellerId)
    )

    setMissingShippingSellers(Array.from(missingSellerIds))

    if (missingSellerIds.length > 0 && !cart.shipping_methods?.length) {
      setMissingModal(true)
    }
  }, [cart])

  useEffect(() => {
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }
  }, [availableShippingMethods])

  const handleSetShippingMethod = async (id: string | null) => {
    setIsLoadingPrices(true)
    setError(null)

    if (!id) {
      setIsLoadingPrices(false)
      return
    }

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id }).catch(
      (err) => {
        setError(err.message)
      }
    )

    onSelectedChange && onSelectedChange(id)
    setIsLoadingPrices(false)
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const groupedBySellerId = _shippingMethods?.reduce((acc: any, method) => {
    const sellerId = method.seller_id!

    if (!acc[sellerId]) {
      acc[sellerId] = []
    }

    acc[sellerId]?.push(method)
    return acc
  }, {})

  const handleEdit = () => {
    router.replace(pathname + "?step=delivery")
  }

  const missingSellers = cart.items
    ?.filter((item) =>
      missingShippingSellers.includes(item.product?.seller?.id!)
    )
    .map((item) => item.product?.seller?.name)

  return (
    <div className="border p-4 rounded-sm bg-ui-bg-interactive">
      {/* Header */}
      {!hideHeader && (
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline items-center"
        >
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
          Delivery
        </Heading>
        {!isOpen && (
          <Text>
            <Button onClick={handleEdit} variant="tonal">
              Edit
            </Button>
          </Text>
        )}
      </div>
      )}

      {/* Embedded/Open content */}
      {isOpen ? (
        <>
          <div className="grid">
            <div data-testid="delivery-options-container">
              <div className="pb-8 md:pt-0 pt-2">
                {Object.keys(groupedBySellerId).map((key) => {
                  const methods = groupedBySellerId[key]
                  return (
                    <div key={key} className="mb-4">
                      {!hideHeader && (
                      <Heading level="h3" className="mb-2">
                          {methods[0].seller_name}
                      </Heading>
                      )}

                      {showAsCards ? (
                        <div className="grid grid-cols-1 gap-3">
                          {methods.map((option: any) => {
                            const price =
                              option.price_type === "flat"
                                ? option.amount
                                : calculatedPricesMap[option.id]
                            const formattedPrice = price
                              ? convertToLocale({
                                  amount: price,
                                  currency_code: cart?.currency_code,
                                })
                              : "-"
                            const isSelected =
                              selectedId
                                ? selectedId === option.id
                                : cart.shipping_methods?.[0]?.id === option.id
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSetShippingMethod(option.id)}
                                className={clsx(
                                  "w-full text-left border rounded-md p-4 hover:bg-gray-50",
                                  isSelected && "ring-2 ring-primary"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{option.name}</span>
                                    {/* Placeholder for delivery time if available */}
                                    {option?.data?.delivery_time && (
                                      <span className="text-sm text-gray-600">
                                        {option.data.delivery_time}
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-medium">{formattedPrice}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                      <Listbox
                        value={cart.shipping_methods?.[0]?.id}
                        onChange={(value) => {
                          handleSetShippingMethod(value)
                        }}
                      >
                        <div className="relative">
                          <Listbox.Button
                            className={clsx(
                              "relative w-full flex justify-between items-center px-4 h-12 bg-component-secondary text-left  cursor-default focus:outline-none border rounded-lg focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-gray-300 focus-visible:ring-offset-2 focus-visible:border-gray-300 text-base-regular"
                            )}
                          >
                            {({ open }) => (
                              <>
                                <span className="block truncate">
                                  Choose delivery option
                                </span>
                                <ChevronUpDown
                                  className={clx(
                                    "transition-rotate duration-200",
                                    {
                                      "transform rotate-180": open,
                                    }
                                  )}
                                />
                              </>
                            )}
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              className="absolute z-20 w-full overflow-auto text-small-regular bg-white border rounded-lg border-top-0 max-h-60 focus:outline-none sm:text-sm"
                              data-testid="shipping-address-options"
                            >
                                {methods.map((option: any) => {
                                return (
                                  <Listbox.Option
                                    className="cursor-pointer select-none relative pl-6 pr-10 hover:bg-gray-50 py-4 border-b"
                                    value={option.id}
                                    key={option.id}
                                  >
                                    {option.name}
                                    {" - "}
                                    {option.price_type === "flat" ? (
                                      convertToLocale({
                                        amount: option.amount!,
                                        currency_code: cart?.currency_code,
                                      })
                                    ) : calculatedPricesMap[option.id] ? (
                                      convertToLocale({
                                        amount: calculatedPricesMap[option.id],
                                        currency_code: cart?.currency_code,
                                      })
                                    ) : isLoadingPrices ? (
                                      <Loader />
                                    ) : (
                                      "-"
                                    )}
                                  </Listbox.Option>
                                )
                              })}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                      )}
                    </div>
                  )
                })}
                {cart && (cart.shipping_methods?.length ?? 0) > 0 && !showAsCards && (
                  <div className="flex flex-col">
                    {cart.shipping_methods?.map((method) => (
                      <CartShippingMethodRow
                        key={method.id}
                        method={method}
                        currency_code={cart.currency_code}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            {showContinue && (
            <Button
                onClick={() => router.push(pathname + "?step=payment", { scroll: false })}
              variant="tonal"
              disabled={!cart.shipping_methods?.[0]}
              loading={isLoadingPrices}
            >
              Continue to payment
            </Button>
            )}
          </div>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col">
                {cart.shipping_methods?.map((method) => (
                  <div key={method.id} className="mb-4 border rounded-md p-4">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Method
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {method.name}{" "}
                      {convertToLocale({
                        amount: method.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartShippingMethodsSection
