import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const SocialSection = () => {
  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      icon: "📷"
    },
    {
      name: "Facebook", 
      href: "#",
      icon: "📘"
    },
    {
      name: "TikTok",
      href: "#",
      icon: "🎵"
    },
    {
      name: "LinkedIn",
      href: "#", 
      icon: "💼"
    }
  ]

  const footerLinks = [
    {
      title: "Our Company",
      links: [
        { name: "Our Stores", href: "/stores" },
        { name: "Sustainability", href: "/sustainability" },
        { name: "Our Story", href: "/about" },
        { name: "Reviews", href: "/reviews" }
      ]
    },
    {
      title: "Help",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Returns", href: "/returns" },
        { name: "Shipping Information", href: "/shipping" },
        { name: "Washing Instructions", href: "/care" },
        { name: "Fit Guide", href: "/fit-guide" },
        { name: "FAQs", href: "/faq" }
      ]
    },
    {
      title: "Contact",
      links: [
        { name: "Chat", href: "/chat" },
        { name: "Contact Us", href: "/contact" },
        { name: "Track", href: "/tracking" },
        { name: "Returns", href: "/returns" }
      ]
    }
  ]

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        {/* Social Media Links */}
        <div className="flex justify-center gap-6 mb-12">
          {socialLinks.map((link, index) => (
            <LocalizedClientLink
              key={index}
              href={link.href}
              className="text-3xl hover:scale-110 transition-transform"
              aria-label={link.name}
            >
              {link.icon}
            </LocalizedClientLink>
          ))}
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <LocalizedClientLink 
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-200 pt-8">
          <p className="text-gray-600 mb-4">
            {new Date().getFullYear()} All Rights Reserved.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <LocalizedClientLink href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </LocalizedClientLink>
            <LocalizedClientLink href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms Of Use
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
} 