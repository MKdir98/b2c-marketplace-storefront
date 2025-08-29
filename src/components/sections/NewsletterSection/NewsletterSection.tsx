"use client"
import { useState } from "react"

export const NewsletterSection = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubscribed(true)
      setEmail("")
      // Here you would typically send the email to your newsletter service
    }
  }

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay in the know.
        </h2>
        
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              You can unsubscribe by contacting us or using the unsubscribe link. 
              You acknowledge and agree to our Privacy Policy.
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <p className="text-xl mb-2">Thank you for subscribing!</p>
            <p className="text-gray-400">
              You'll receive updates on new arrivals, sales, and sustainability initiatives.
            </p>
          </div>
        )}
      </div>
    </section>
  )
} 