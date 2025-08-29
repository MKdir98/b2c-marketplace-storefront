'use client'

import PaymentWrapper from '@/components/organisms/PaymentContainer/PaymentWrapper'
import { CartSummary } from '@/components/organisms'
import { retrieveCart, setShippingMethod, updateCart, listCartOptions, removeShippingMethod, placeOrder } from '@/lib/data/cart'
import { retrieveCustomer } from '@/lib/data/customer'
import { listCartPaymentMethods } from '@/lib/data/payment'
import { initiatePaymentSession } from "@/lib/data/cart"
import { useEffect, useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { RadioGroup } from "@headlessui/react"
import { paymentInfoMap, isStripe as isStripeFunc } from "@/lib/constants"
import PaymentContainer, { StripeCardContainer } from "@/components/organisms/PaymentContainer/PaymentContainer"
import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { Input } from "@/components/atoms"
import { convertToLocale } from "@/lib/helpers/money"
import clsx from "clsx"
import { HttpTypes } from "@medusajs/types"

export default function CheckoutClient() {
  const [cart, setCart] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [shippingMethods, setShippingMethods] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null)

  // Address form data
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": "",
    "shipping_address.last_name": "",
    "shipping_address.address_1": "",
    "shipping_address.postal_code": "",
    "shipping_address.city": "",
    "shipping_address.country_code": "ir",
    "shipping_address.province": "",
    "shipping_address.phone": "",
    email: "",
  })

  // Cities and states data
  const [statesData, setStatesData] = useState<Array<{ id: string; name: string }>>([])
  const [citiesData, setCitiesData] = useState<Array<{ id: string; name: string; state_id: string }>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [shippingLoading, setShippingLoading] = useState<boolean>(false)

  // Payment state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")

  // Address form error
  const [addressError, setAddressError] = useState<string | null>(null)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const load = async () => {
      const c = await retrieveCart()
      if (!c) return
      setCart(c)
      
      // Initialize form data with existing cart data
      setFormData({
        "shipping_address.first_name": c?.shipping_address?.first_name || "",
        "shipping_address.last_name": c?.shipping_address?.last_name || "",
        "shipping_address.address_1": c?.shipping_address?.address_1 || "",
        "shipping_address.postal_code": c?.shipping_address?.postal_code || "",
        "shipping_address.city": c?.shipping_address?.city || "",
        "shipping_address.country_code": "ir",
        "shipping_address.province": c?.shipping_address?.province || "",
        "shipping_address.phone": c?.shipping_address?.phone || "",
        email: c?.email || "",
      })

      const cust = await retrieveCustomer()
      setCustomer(cust)
      const pm = await listCartPaymentMethods(c.region?.id ?? '')
      setPaymentMethods(pm || [])
      
      // Set initial payment method
      const activeSession = c.payment_collection?.payment_sessions?.find(
        (paymentSession: any) => paymentSession.status === "pending"
      )
      setSelectedPaymentMethod(activeSession?.provider_id ?? "")
    }
    load()
  }, [])

  // Load states and cities
  useEffect(() => {
    const loadStatesAndCities = async () => {
      setLoading(true)
      try {
        const sres = await fetch(`/api/store/states?country_code=ir`)
        const sjson = await sres.json()
        const states = sjson.states || []
        setStatesData(states)
        if (formData["shipping_address.province"]) {
          const st = states.find((s: any) => s.name === formData["shipping_address.province"]) || null
          if (st) {
            const cres = await fetch(`/api/store/cities?country_code=ir&state_id=${st.id}`)
            const cjson = await cres.json()
            setCitiesData(cjson.cities || [])
          }
        }
      } catch {}
      setLoading(false)
    }
    loadStatesAndCities()
  }, [formData["shipping_address.province"]])

  const provinces = useMemo(() => statesData.map((s) => s.name), [statesData])
  const selectedState = useMemo(
    () => statesData.find((s) => s.name === formData["shipping_address.province"]),
    [statesData, formData]
  )

  useEffect(() => {
    const loadCities = async () => {
      if (!selectedState) {
        setCitiesData([])
        return
      }
      try {
        const cres = await fetch(`/api/store/cities?country_code=ir&state_id=${selectedState.id}`)
        const cjson = await cres.json()
        setCitiesData(cjson.cities || [])
      } catch {}
    }
    loadCities()
  }, [selectedState?.id])

  const provinceCities = useMemo(() => citiesData.map((c: { name: string }) => c.name), [citiesData])

  // Fetch shipping methods when city changes (for step 1)
  useEffect(() => {
    const fetchShippingMethodsOnCityChange = async () => {
      if (!formData["shipping_address.city"] || !formData["shipping_address.province"] || !cart?.id) return

      setShippingLoading(true)
      try {
        // First update cart with current address to get shipping options
        const tempAddressData = {
          shipping_address: {
            city: formData["shipping_address.city"],
            country_code: formData["shipping_address.country_code"],
            province: formData["shipping_address.province"],
          }
        }
        
        await updateCart(tempAddressData)
        const updatedCart = await retrieveCart()
        if (updatedCart) {
          setCart(updatedCart)
          
          // Now fetch shipping methods
          const sm = await listCartOptions()
          console.log('[FRONTEND] Shipping options response:', sm);
          const methods = sm?.shipping_options || []
          setShippingMethods(methods)
          
          // Clear previous selection when city changes
          setSelectedShippingId(null)
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error)
      } finally {
        setShippingLoading(false)
      }
    }

    // Only fetch if we're in step 1 or later and have both city and province
    if (currentStep >= 1 && formData["shipping_address.city"] && formData["shipping_address.province"]) {
      fetchShippingMethodsOnCityChange()
    }
  }, [formData["shipping_address.city"], formData["shipping_address.province"], cart?.id])

  // Auto-select shipping method if only one option is available in step 4
  useEffect(() => {
    if (currentStep === 4 && shippingMethods.length === 1 && !selectedShippingId) {
      setSelectedShippingId(shippingMethods[0].id)
    }
  }, [currentStep, shippingMethods, selectedShippingId])

  // Auto-select payment method if only one option is available in step 5
  useEffect(() => {
    if (currentStep === 5 && paymentMethods.length === 1 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].id)
    }
  }, [currentStep, paymentMethods, selectedPaymentMethod])

  const TOTAL_STEPS = 5

  const stepTitle = useMemo(() => {
    switch (currentStep) {
      case 1:
        return 'استان و شهر'
      case 2:
        return 'آدرس و کد پستی'
      case 3:
        return 'اطلاعات تحویل گیرنده'
      case 4:
        return 'روش ارسال'
      default:
        return 'روش پرداخت'
    }
  }, [currentStep])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "shipping_address.province") {
      setFormData({
        ...formData,
        [name]: value,
        "shipping_address.city": "" // Reset city when province changes
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData["shipping_address.province"]) && Boolean(formData["shipping_address.city"])
      case 2:
        return Boolean(formData["shipping_address.address_1"]) && Boolean(formData["shipping_address.postal_code"])
      case 3:
        return (
          Boolean(formData["shipping_address.first_name"]) &&
          Boolean(formData["shipping_address.last_name"]) &&
          Boolean(formData["shipping_address.phone"])
        )
      case 4:
        return Boolean(selectedShippingId || cart?.shipping_methods?.[0]?.id)
      case 5:
        return Boolean(selectedPaymentMethod)
      default:
        return false
    }
  }

  const handleNext = async () => {
    if (currentStep === 3) {
      // Submit complete address form only when going from step 3 to 4
      setAddressError(null)
      try {
        // Format the address data for updateCart
        const addressData = {
          shipping_address: {
            first_name: formData["shipping_address.first_name"],
            last_name: formData["shipping_address.last_name"],
            address_1: formData["shipping_address.address_1"],
            postal_code: formData["shipping_address.postal_code"],
            city: formData["shipping_address.city"],
            country_code: formData["shipping_address.country_code"],
            province: formData["shipping_address.province"],
            phone: formData["shipping_address.phone"],
          },
          billing_address: {
            first_name: formData["shipping_address.first_name"],
            last_name: formData["shipping_address.last_name"],
            address_1: formData["shipping_address.address_1"],
            postal_code: formData["shipping_address.postal_code"],
            city: formData["shipping_address.city"],
            country_code: formData["shipping_address.country_code"],
            province: formData["shipping_address.province"],
            phone: formData["shipping_address.phone"],
          },
        }
        
        await updateCart(addressData)
        const updatedCart = await retrieveCart()
        if (updatedCart) {
          setCart(updatedCart)
          
          // Refresh shipping methods with complete address
          const sm = await listCartOptions()
          const methods = sm?.shipping_options || []
          setShippingMethods(methods)
          
          // Pre-select first method if none selected and no existing shipping methods
          if (methods.length && !selectedShippingId && (!updatedCart.shipping_methods || updatedCart.shipping_methods.length === 0)) {
            await setShippingMethod({ cartId: updatedCart.id, shippingMethodId: methods[0].id })
            setSelectedShippingId(methods[0].id)
          }
          
          // Auto-select if only one shipping method is available
          if (methods.length === 1 && !selectedShippingId) {
            setSelectedShippingId(methods[0].id)
          }
        }
      } catch (err: any) {
        setAddressError(err.message || "خطا در ثبت آدرس")
        return // Don't proceed if there's an error
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const handlePaymentSubmit = async () => {
    setIsLoading(true)
    try {
      const activeSession = cart.payment_collection?.payment_sessions?.find(
        (paymentSession: any) => paymentSession.status === "pending"
      )
      
      const shouldInputCard = isStripeFunc(selectedPaymentMethod) && !activeSession
      const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        // Complete the order for manual payment
        await placeOrder(cart.id)
        // The placeOrder function will redirect to order confirmation page
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetShippingMethod = async (id: string | null) => {
    if (!id) return
    
    try {
      // Remove existing shipping methods first to avoid duplicates
      if (cart.shipping_methods && cart.shipping_methods.length > 0) {
        for (const method of cart.shipping_methods) {
          await removeShippingMethod(method.id)
        }
      }
      
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      setSelectedShippingId(id)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!cart) return null

  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )
  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  const isStripe = isStripeFunc(selectedPaymentMethod)

  const renderStepContent = () => {
    const commonButtonClasses = "px-4 py-2 rounded text-white bg-black hover:bg-gray-900 text-sm disabled:opacity-50"
    const backButtonClasses = "border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-50"

    // Step 1: State/City
    if (currentStep === 1) {
      return (
        <div className="border p-4 rounded-sm bg-ui-bg-interactive">
          <div className="pb-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="label-md mb-1 block">استان</label>
                <select
                  name="shipping_address.province"
                  value={formData["shipping_address.province"]}
                  onChange={handleChange}
                  className="w-full border rounded-sm h-12 px-3 bg-component-secondary"
                  required
                  disabled={loading}
                >
                  <option value="" disabled hidden>انتخاب استان</option>
                  {provinces.map((s: string, idx: number) => (
                    <option key={`${s}-${idx}`} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-md mb-1 block">شهر</label>
                <select
                  name="shipping_address.city"
                  value={formData["shipping_address.city"]}
                  onChange={handleChange}
                  className="w-full border rounded-sm h-12 px-3 bg-component-secondary"
                  required
                  disabled={loading || !formData["shipping_address.province"]}
                >
                  <option value="" disabled hidden>انتخاب شهر</option>
                  {provinceCities.map((c: string, idx: number) => (
                    <option key={`${c}-${idx}`} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div style={{ visibility: 'hidden' }}>
              <button className={backButtonClasses}>بازگشت</button>
            </div>
            <button
              onClick={handleNext}
              className={commonButtonClasses}
              disabled={!isStepValid() || shippingLoading}
            >
              ادامه
            </button>
          </div>
        </div>
      )
    }

    // Step 2: Address and Postal Code
    if (currentStep === 2) {
      return (
        <div className="border p-4 rounded-sm bg-ui-bg-interactive">
          <div className="pb-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="col-span-1 lg:col-span-2">
                <Input
                  label="آدرس"
                  name="shipping_address.address_1"
                  autoComplete="address-line1"
                  value={formData["shipping_address.address_1"]}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                label="کد پستی"
                name="shipping_address.postal_code"
                autoComplete="postal-code"
                value={formData["shipping_address.postal_code"]}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={handleBack} className={backButtonClasses}>
              بازگشت
            </button>
            <button
              onClick={handleNext}
              className={commonButtonClasses}
              disabled={!isStepValid()}
            >
              ادامه
            </button>
          </div>
        </div>
      )
    }

    // Step 3: Recipient Contact
    if (currentStep === 3) {
      return (
        <div className="border p-4 rounded-sm bg-ui-bg-interactive">
          <div className="pb-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                label="نام تحویل گیرنده"
                name="shipping_address.first_name"
                autoComplete="given-name"
                value={formData["shipping_address.first_name"]}
                onChange={handleChange}
                required
              />
              <Input
                label="نام خانوادگی تحویل گیرنده"
                name="shipping_address.last_name"
                autoComplete="family-name"
                value={formData["shipping_address.last_name"]}
                onChange={handleChange}
                required
              />
              <div className="col-span-1 lg:col-span-2">
                <Input
                  label="تلفن تحویل گیرنده"
                  name="shipping_address.phone"
                  autoComplete="tel"
                  value={formData["shipping_address.phone"]}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <ErrorMessage
              error={addressError}
              data-testid="address-error-message"
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={handleBack} className={backButtonClasses}>
              بازگشت
            </button>
            <button
              onClick={handleNext}
              className={commonButtonClasses}
              disabled={!isStepValid()}
            >
              ادامه
            </button>
          </div>
        </div>
      )
    }

    // Step 4: Shipping Methods
    if (currentStep === 4) {
      return (
        <div className="border p-4 rounded-sm bg-ui-bg-interactive">
          <div className="pb-8 max-w-2xl mx-auto">
            {shippingMethods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">هیچ روش ارسالی برای این آدرس یافت نشد</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {shippingMethods?.map((option: any) => {
                  const price = option.price_type === "flat" ? option.amount : 0
                  const formattedPrice = price
                    ? convertToLocale({
                        amount: price,
                        currency_code: cart?.currency_code,
                      })
                    : "-"
                  const isSelected = selectedShippingId
                    ? selectedShippingId === option.id
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
            )}
            <ErrorMessage error={error} />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={handleBack} className={backButtonClasses}>
              بازگشت
            </button>
            <button
              onClick={handleNext}
              className={commonButtonClasses}
              disabled={!isStepValid()}
            >
              ادامه
            </button>
          </div>
        </div>
      )
    }

    // Step 5: Payment
    return (
      <div className="border p-4 rounded-sm bg-ui-bg-interactive">
        <div className="pb-8 max-w-2xl mx-auto">
          {/* Payment Methods */}
          <div className="grid gap-4 py-6">
            <div>
              <RadioGroup value={selectedPaymentMethod} onChange={setPaymentMethod}>
                <div className="flex flex-col gap-y-2">
                  {paymentMethods?.map((paymentMethod) => {
                    return (
                      <PaymentContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        key={paymentMethod.id}
                      />
                    )
                  })}
                </div>
              </RadioGroup>
            </div>

            {isStripe && (
              <div>
                <StripeCardContainer
                  paymentProviderId={selectedPaymentMethod}
                  selectedPaymentOptionId={selectedPaymentMethod}
                  paymentInfoMap={paymentInfoMap}
                  setCardBrand={setCardBrand}
                  setError={setError}
                  setCardComplete={setCardComplete}
                />
              </div>
            )}

                      <ErrorMessage error={error} />
        </div>

        {/* Price Summary */}
        <div className="w-full mb-6 border rounded-sm p-4">
          <CartSummary
            item_total={cart?.item_subtotal || 0}
            shipping_total={cart?.shipping_subtotal || 0}
            total={cart?.total || 0}
            currency_code={cart?.currency_code || ""}
            tax={cart?.tax_total || 0}
            labels={{
              items: "مجموع کالاها:",
              delivery: "هزینه ارسال:",
              tax: "مالیات:",
              total: "مبلغ قابل پرداخت:"
            }}
          />
        </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <button onClick={handleBack} className={backButtonClasses}>
            بازگشت
          </button>
          <button
            onClick={handlePaymentSubmit}
            className={commonButtonClasses}
            disabled={
              isLoading ||
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
          >
            {isLoading ? "پردازش..." : !activeSession && isStripeFunc(selectedPaymentMethod)
              ? "ورود اطلاعات کارت"
              : "تکمیل خرید"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <PaymentWrapper cart={cart}>
      <main className="container">
        {/* Single unified progress bar */}
        <div className="max-w-3xl mx-auto mt-4">
          <div className="mb-2">
            <h3 className="text-lg font-medium">{stepTitle}</h3>
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-medium">گام {currentStep} از {TOTAL_STEPS}</p>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
                <span
                  key={`step-${idx}`}
                  className={`h-2.5 w-10 rounded-full ${idx < currentStep ? 'bg-primary' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {renderStepContent()}
        </div>
      </main>
    </PaymentWrapper>
  )
} 