"use client"
import {
  FieldError,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addressSchema, AddressFormData } from "./schema"
import { LabeledInput } from "@/components/cells"
import { Button } from "@/components/atoms"
import { addCustomerAddress, updateCustomerAddress } from "@/lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "@/components/cells/CountrySelect/CountrySelect"
import { useState } from "react"
import { getCurrentLocation, reverseGeocode } from "@/lib/services/geolocation"

interface Props {
  defaultValues?: AddressFormData
  regions: HttpTypes.StoreRegion[]
  handleClose?: () => void
}

export const emptyDefaultAddressValues = {
  addressName: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  countryCode: "",
  postalCode: "",
  company: "",
  province: "",
  phone: "",
  latitude: null,
  longitude: null,
}

export const AddressForm: React.FC<Props> = ({ defaultValues, regions, handleClose }) => {
  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || emptyDefaultAddressValues,
  })

  return (
    <FormProvider {...methods}>
      <Form regions={regions} handleClose={handleClose} />
    </FormProvider>
  )
}

const Form: React.FC<Props> = ({ regions, handleClose }) => {
  const [error, setError] = useState<string>()
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showMapSelector, setShowMapSelector] = useState(false)
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AddressFormData>()

  const watchedLatitude = watch("latitude")
  const watchedLongitude = watch("longitude")

  const region = {
    countries: regions.flatMap((region) => region.countries),
  }

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true)
    setError("")
    
    try {
      const coordinates = await getCurrentLocation()
      const addressData = await reverseGeocode(coordinates.latitude, coordinates.longitude)
      
      if (addressData) {
        setValue("address", addressData.address_1)
        setValue("city", addressData.city)
        setValue("postalCode", addressData.postal_code)
        setValue("province", addressData.province || "")
        setValue("countryCode", addressData.country_code)
        setValue("latitude", addressData.latitude)
        setValue("longitude", addressData.longitude)
      } else {
        // Still save coordinates even if address lookup fails
        setValue("latitude", coordinates.latitude)
        setValue("longitude", coordinates.longitude)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to get location")
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleClearLocation = () => {
    setValue("latitude", null)
    setValue("longitude", null)
  }

  const submit = async (data: FieldValues) => {
    const formData = new FormData()
    formData.append("addressId", data.addressId || "")
    formData.append("address_name", data.addressName)
    formData.append("first_name", data.firstName)
    formData.append("last_name", data.lastName)
    formData.append("address_1", data.address)
    formData.append("address_2", "")
    formData.append("province", data.province)
    formData.append("city", data.city)
    formData.append("country_code", data.countryCode)
    formData.append("postal_code", data.postalCode)
    formData.append("company", data.company)
    formData.append("phone", data.phone)
    
    // Add geolocation data
    if (data.latitude) formData.append("latitude", data.latitude.toString())
    if (data.longitude) formData.append("longitude", data.longitude.toString())

    const res = data.addressId
      ? await updateCustomerAddress(formData)
      : await addCustomerAddress(formData)

    if (!res.success) {
      setError(res.error)
      return
    }

    setError("")
    handleClose && handleClose()
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Geolocation Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-3">📍 Location Options</h3>
        <div className="flex gap-2 mb-3">
          <Button
            type="button"
            variant="filled"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            className="text-xs px-3 py-1"
          >
            {isGettingLocation ? "Getting Location..." : "Use Current Location"}
          </Button>
          <Button
            type="button"
            variant="text"
            onClick={() => setShowMapSelector(!showMapSelector)}
            className="text-xs px-3 py-1"
          >
            {showMapSelector ? "Hide Map" : "Select on Map"}
          </Button>
          {(watchedLatitude && watchedLongitude) && (
            <Button
              type="button"
              variant="text"
              onClick={handleClearLocation}
              className="text-xs px-3 py-1 text-red-600"
            >
              Clear Location
            </Button>
          )}
        </div>
        
        {(watchedLatitude && watchedLongitude) && (
          <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
            📍 Coordinates: {watchedLatitude.toFixed(6)}, {watchedLongitude.toFixed(6)}
          </div>
        )}

        {showMapSelector && (
          <div className="mt-3 p-4 bg-white rounded border">
            <p className="text-sm text-gray-600 mb-2">
              Interactive map will be available after installing map dependencies.
              For now, use &quot;Use Current Location&quot; button above.
            </p>
            {/* Future: Add map component here */}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <LabeledInput
          label="Address Name *"
          placeholder="e.g., Home, Work, Office"
          {...register("addressName")}
          error={errors.addressName}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <LabeledInput
            label="First Name *"
            {...register("firstName")}
            error={errors.firstName}
          />
          <LabeledInput
            label="Last Name *"
            {...register("lastName")}
            error={errors.lastName}
          />
        </div>
        
        <LabeledInput
          label="Address *"
          {...register("address")}
          error={errors.address}
        />
        
        <LabeledInput
          label="Company"
          {...register("company")}
          error={errors.company}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <LabeledInput
            label="City *"
            {...register("city")}
            error={errors.city}
          />
          <LabeledInput
            label="Postal Code *"
            {...register("postalCode")}
            error={errors.postalCode}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <CountrySelect
            {...register("countryCode")}
            placeholder="Select Country"
            region={regions[0]}
          />
          <LabeledInput
            label="State/Province"
            {...register("province")}
            error={errors.province}
          />
        </div>
        
        <LabeledInput
          label="Phone *"
          {...register("phone")}
          error={errors.phone}
        />

        {/* Hidden fields for coordinates */}
        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />
      </div>

      <div className="flex gap-3 pt-4 mt-6 border-t">
        <Button type="submit" className="flex-1">
          Save Address
        </Button>
        {handleClose && (
          <Button type="button" variant="text" onClick={handleClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
