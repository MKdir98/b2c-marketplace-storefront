"use client"

import { Button } from "@/components/atoms"
import { ChatBox } from "@/components/cells/ChatBox/ChatBox"
import { Modal } from "@/components/molecules"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { SellerProps } from "@/types/seller"
import { MessageIcon } from "@/icons"
import { useTranslations } from 'next-intl'

const TALKJS_APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID || ""
const isTalkJSConfigured = TALKJS_APP_ID && TALKJS_APP_ID !== '<your talkjs app id>' && TALKJS_APP_ID.length > 10

// Helper function to get translations with fallback
const useTranslationsWithFallback = () => {
  try {
    const t = useTranslations('common')
    return {
      chat: t('chat'),
      writeToSeller: t('writeToSeller')
    }
  } catch (error) {
    // Check if we're in Persian environment based on document direction
    const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
    if (isRTL) {
      return {
        chat: 'چت',
        writeToSeller: 'پیام به فروشنده'
      }
    }
    return {
      chat: 'Chat',
      writeToSeller: 'Write to seller'
    }
  }
}

export const Chat = ({
  user,
  seller,
  buttonClassNames,
  icon,
  product,
  subject,
  order_id,
}: {
  user: HttpTypes.StoreCustomer | null
  seller: SellerProps
  buttonClassNames?: string
  icon?: boolean
  product?: HttpTypes.StoreProduct
  subject?: string
  order_id?: string
}) => {
  const [modal, setModal] = useState(false)
  const translations = useTranslationsWithFallback()

  if (!isTalkJSConfigured || !user) {
    return null
  }

  return (
    <>
      <Button
        variant="tonal"
        onClick={() => setModal(true)}
        className={buttonClassNames}
      >
        {icon ? <MessageIcon size={20} /> : translations.writeToSeller}
      </Button>
      {modal && (
        <Modal heading={translations.chat} onClose={() => setModal(false)}>
          <div className="px-4">
            <ChatBox
              order_id={order_id}
              product_id={product?.id}
              subject={subject}
              currentUser={{
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                photoUrl: "/talkjs-placeholder.jpg",
                role: "customer",
              }}
              supportUser={{
                id: seller.id,
                name: seller.name,
                email: seller.email || null,
                photoUrl: seller.photo || "/talkjs-placeholder.jpg",
                role: "seller",
              }}
            />
          </div>
        </Modal>
      )}
    </>
  )
}
