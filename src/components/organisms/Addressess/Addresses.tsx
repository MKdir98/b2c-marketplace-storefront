"use client"
import { Button, Card } from "@/components/atoms"
import { AddressForm, Modal } from "@/components/molecules"
import { emptyDefaultAddressValues } from "@/components/molecules/AddressForm/AddressForm"
import { AddressFormData } from "@/components/molecules/AddressForm/schema"
import { deleteCustomerAddress, setDefaultCustomerAddress } from "@/lib/data/customer"
import { cn } from "@/lib/utils"
import { HttpTypes } from "@medusajs/types"
import { isEmpty } from "lodash"
import { useState, useEffect } from "react"
import { calculateDistance, GeolocationCoordinates } from "@/lib/services/geolocation"

// Helper function to safely display coordinates
const formatCoordinate = (coord: unknown): string => {
  if (typeof coord === 'number') return coord.toFixed(6)
  if (typeof coord === 'string') return Number(coord).toFixed(6)
  return 'N/A'
}

interface AddressDisplayProps {
  address: HttpTypes.StoreCustomerAddress
  isDefault?: boolean
  onEdit: () => void
  onDelete: () => void
  onSetDefault?: () => void
  userLocation?: GeolocationCoordinates
}

const AddressCard = ({ 
  address, 
  isDefault, 
  onEdit, 
  onDelete, 
  onSetDefault,
  userLocation 
}: AddressDisplayProps) => {
  const hasCoordinates = Boolean(address.metadata?.latitude && address.metadata?.longitude)
  const addressCoords = hasCoordinates ? {
    latitude: address.metadata?.latitude as number,
    longitude: address.metadata?.longitude as number
  } : null

  const distance = userLocation && addressCoords 
    ? calculateDistance(userLocation, addressCoords)
    : null

  return (
    <Card className={cn(
      "p-4 border transition-all hover:shadow-md",
      isDefault ? "border-green-500 bg-green-50" : "border-gray-200"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-lg">{address.address_name}</h3>
          {isDefault && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Default
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="text"
            onClick={onEdit}
            className="text-sm px-2 py-1"
          >
            Edit
          </Button>
          <Button
            variant="text"
            onClick={onDelete}
            className="text-sm px-2 py-1 text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <p className="font-medium text-gray-900">
          {address.first_name} {address.last_name}
        </p>
        <p>{address.address_1}</p>
        {address.address_2 && <p>{address.address_2}</p>}
        <p>
          {address.city}, {address.province} {address.postal_code}
        </p>
        <p>{address.country_code}</p>
        {address.phone && <p>📞 {address.phone}</p>}
        {address.company && <p>🏢 {address.company}</p>}
      </div>

      {hasCoordinates && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-1">
            <p>📍 Coordinates: {`${formatCoordinate(address.metadata?.latitude)}, ${formatCoordinate(address.metadata?.longitude)}`}</p>
            {distance && (
              <p>📏 Distance from you: {distance.toFixed(1)} km</p>
            )}
          </div>
        </div>
      )}

      {!isDefault && onSetDefault && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Button
            variant="text"
            onClick={onSetDefault}
            className="text-sm w-full"
          >
            Set as Default
          </Button>
        </div>
      )}
    </Card>
  )
}

export const Addresses = ({
  user,
  regions,
}: {
  user: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}) => {
  const [showForm, setShowForm] = useState(false)
  const [deleteAddress, setDeleteAddress] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null)

  const [defaultValues, setDefaultValues] = useState<AddressFormData | null>(
    null
  )

  // Get user's current location for distance calculations
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.warn("Could not get user location:", error)
        }
      )
    }
  }, [])

  const countries = regions.flatMap((region) => region.countries)

  const handleEdit = (addressId: string) => {
    const address = user.addresses.find((address) => address.id === addressId)
    if (address) {
      setDefaultValues({
        addressId: addressId,
        addressName: address.address_name || "",
        firstName: address.first_name || "",
        lastName: address.last_name || "",
        address: address.address_1 || "",
        city: address.city || "",
        countryCode: address.country_code || "",
        postalCode: address.postal_code || "",
        company: address.company || "",
        province: address.province || "",
        phone: address.phone || user.phone || "",
        latitude: address.metadata?.latitude as number || null,
        longitude: address.metadata?.longitude as number || null,
      })
      setShowForm(true)
    }
  }

  const handleDelete = async (addressId: string) => {
    await deleteCustomerAddress(addressId)
    setDeleteAddress(null)
  }

  const handleAdd = () => {
    setDefaultValues(emptyDefaultAddressValues)
    setDeleteAddress(null)
    setShowForm(true)
  }

  const handleSetDefault = async (addressId: string) => {
    await setDefaultCustomerAddress(addressId)
  }

  // Group addresses by type for better organization
  const workAddresses = user.addresses.filter(addr => 
    addr.address_name?.toLowerCase().includes('work') || 
    addr.address_name?.toLowerCase().includes('office')
  )
  const homeAddresses = user.addresses.filter(addr => 
    addr.address_name?.toLowerCase().includes('home')
  )
  const otherAddresses = user.addresses.filter(addr => 
    !workAddresses.includes(addr) && !homeAddresses.includes(addr)
  )

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button onClick={handleAdd}>
          Add New Address
        </Button>
      </div>

      {user.addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">
            Add your first address to make checkout faster and easier.
          </p>
          <Button onClick={handleAdd}>
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Home Addresses */}
          {homeAddresses.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏠 Home Addresses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homeAddresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isDefault={address.is_default_shipping}
                    onEdit={() => handleEdit(address.id)}
                    onDelete={() => setDeleteAddress(address.id)}
                    onSetDefault={() => handleSetDefault(address.id)}
                    userLocation={userLocation || undefined}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Work Addresses */}
          {workAddresses.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏢 Work Addresses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workAddresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isDefault={address.is_default_shipping}
                    onEdit={() => handleEdit(address.id)}
                    onDelete={() => setDeleteAddress(address.id)}
                    onSetDefault={() => handleSetDefault(address.id)}
                    userLocation={userLocation || undefined}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Other Addresses */}
          {otherAddresses.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📍 Other Addresses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherAddresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isDefault={address.is_default_shipping}
                    onEdit={() => handleEdit(address.id)}
                    onDelete={() => setDeleteAddress(address.id)}
                    onSetDefault={() => handleSetDefault(address.id)}
                    userLocation={userLocation || undefined}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Address Form Modal */}
      {showForm && (
        <Modal
          heading={defaultValues?.addressId ? "Edit Address" : "Add New Address"}
          onClose={() => setShowForm(false)}
        >
          <AddressForm
            regions={regions}
            defaultValues={defaultValues || undefined}
            handleClose={() => setShowForm(false)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteAddress && (
        <Modal
          heading="Delete Address"
          onClose={() => setDeleteAddress(null)}
        >
          <div className="p-6 text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="text"
                onClick={() => setDeleteAddress(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteAddress && handleDelete(deleteAddress)}
              >
                Delete Address
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
