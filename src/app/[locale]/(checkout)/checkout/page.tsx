import { Metadata } from "next"
import CheckoutClient from "./CheckoutClient"

export const metadata: Metadata = {
  title: "Checkout",
  description: "My cart page - Checkout",
}

export default function Page() {
  return <CheckoutClient />
}
