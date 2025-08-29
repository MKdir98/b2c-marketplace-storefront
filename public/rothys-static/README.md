# Rothy's Homepage - Local Assets

این دایرکتوری شامل نسخه محلی از صفحه خانه Rothy's با تمام فایل‌های CSS و JavaScript هست.

## ساختار فایل‌ها:

```
rothys-static/
├── index.html          # فایل HTML اصلی با لینک‌های محلی
├── rothys-original.html # فایل HTML اصلی دانلود شده از سایت
├── README.md           # این فایل
└── assets/
    ├── css/            # فایل‌های CSS
    ├── js/             # فایل‌های JavaScript
    ├── images/         # تصاویر (اگر نیاز باشه)
    └── [فونت‌ها]       # فایل‌های فونت
```

## نحوه دسترسی:

- **از طریق Next.js**: `http://localhost:3003/fa/rothys-homepage`
- **دسترسی مستقیم**: `http://localhost:3003/rothys-static/index.html`

## فایل‌های دانلود شده:

### CSS Files:
- lib-dna.css - کتابخانه اصلی استایل
- snippet-product-card.css - استایل کارت محصولات
- lib-shoelace.css - کتابخانه UI components
- section-header.css - استایل هدر
- section-banner.css - استایل بنرها
- section-flexible.css - استایل بخش‌های انعطاف پذیر
- section-footer.css - استایل فوتر
- component-desktop-nav-menu.css - استایل منوی ناوبری

### JavaScript Files:
- lib-shopify.js - کتابخانه Shopify
- lib-analytics.js - کتابخانه آنالیتیکس
- lib-mixins.js - میکسین‌ها
- vendor-lit-all.js - کتابخانه Lit
- vendor-shopify-storefront-api-client.js - کلاینت API فروشگاه

### Fonts:
- font-GrifoS-Light.woff2
- font-MaisonNeueWEB-Book.woff2

تمام فایل‌ها از CDN اصلی Rothy's دانلود و به صورت محلی ذخیره شده‌اند.
