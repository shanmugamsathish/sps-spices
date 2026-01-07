// Hero Section Images
import Image1 from '../assets/Image1.png';
import Image2 from '../assets/Image2.png';
import Image3 from '../assets/Image3.png';
import Image4 from '../assets/Image4.png';
import Image5 from '../assets/Image5.png';
import Image6 from '../assets/Image6.png';

// Logo Images
import logo from '../assets/LOGO sps.jpg';
import logoWhite from '../assets/LOGO sps bg.png';
import login from '../assets/login.png';
import register from '../assets/register.png';
import pageNotFound from '../assets/page-not-found.png';

// API URL
export const API_URL = 'http://localhost:7777/api';

// Routes
export const ROUTES = {
    TERMS_AND_CONDITION: '/terms-and-condition',
    PRIVACY_POLICY: '/privacy-policy',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN_LOGIN: '/admin/login',

    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    PRODUCTS: '/products',
    PRODUCT_DETAILS: '/product-details',
    COLLECTIONS: '/collections',
    COLLECTION_PRODUCTS: '/collection-products',
    ADD_TO_WISHLIST: '/add-to-wishlist',
    CART: '/cart',
    MY_ORDERS: '/my-orders',
    PAYMENT: '/payment',

    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_ADD_PRODUCT: '/admin/add-product',
    ADMIN_CUSTOMERS: '/admin/customers',
    ADMIN_ADD_CUSTOMER: '/admin/add-customer',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_COLLECTIONS: '/admin/collections',
    ADMIN_ADD_COLLECTION: '/admin/add-collection',
    ADMIN_PRODUCT_DETAILS: '/admin/product-details',
}

// Hero Section Images
export const HERO_SECTION_IMAGES = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
]

// Hero Section Duration
export const HERO_SECTION_DURATION = 60;

// Logo Images
export const LOGO = {
    LOGO: logo,
    LOGO_WHITE: logoWhite,
    LOGIN: login,
    REGISTER: register,
}

// Page Not Found Images
export const PAGE_NOT_FOUND = {
    PAGE_NOT_FOUND: pageNotFound,
}

// Terms and Conditions
export const TERMS_AND_CONDITION = {
    POLICIES: [
        {
            title: "Product Quality & Packaging",
            text: "All products are fresh, quality-checked, and dispatched in properly sealed packaging."
          },
          {
            title: "Order Confirmation",
            text: "Once an order is placed, a confirmation message or call will be sent. Confirmed orders cannot be canceled."
          },
          {
            title: "Delivery Policy",
            text: "Delivery will be made within 2–7 working days depending on location and availability. The company is not responsible for courier delays or natural issues."
          },
          {
            title: "No Return / No Refund Policy",
            text: "Due to the nature of food items, returns, exchanges, or refunds are not allowed. Damaged or wrong products must be reported within 24 hours of delivery."
          },
          {
            title: "Payment Policy",
            text: "Only online payment is accepted. Cash on Delivery (COD) is not available. Orders are processed only after successful payment."
          },
          {
            title: "Price & Availability Changes",
            text: "Product prices, offers, and stock availability may change without prior notice. Details on the website are considered final."
          }
    ],
    TITLE: "SPS Spices & Dry Fruits — Terms & Conditions",
    DESCRIPTION: "Please read the terms carefully before placing an order. By purchasing from our store, you agree to the policies mentioned below.",
    FOOTER: "If you have any questions regarding these terms, please contact our support team before placing your order.",
}

// Footer Text
export const FOOTER_TEXT = {
  BRAND_NAME: "SPS SPICES AND DRY FRUITS",
  DESCRIPTION: "Pure, aromatic spices and nutrient-rich dry fruits. Sourced with quality, packed with freshness.",
  USEFUL_LINKS: {
      title: "Useful Links",
      links: [
        {
          title: "Home",
          link: "/",
        },
        {
          title: "About",
          link: "/about",
        },
        {
          title: "Products",
          link: "/products",
        },
        {
          title: "Collections",
          link: "/collections",
        },
        {
          title: "Contact Us",
          link: "/contact",
        },
      ],
    },
  CONTACT_INFO: {
    TITLE: "Contact Us",
    ADDRESS: "C2 NAAZYAS ARCADE 4th Main Road Maharaja Nagar Palayamkottai - 627011",
    EMAIL: "spsspices@zohomail.in",
    PHONE: "+91 7092597277 (WhatsApp)",
  },
  POLICIES: {
    TITLE: "Policies",
    PRIVACY_POLICY: {
      title: "Privacy Policy",
      link: "/privacy-policy",
    },
    TERMS_AND_CONDITIONS: {
      title: "Terms & Conditions",
      link: "/terms-and-conditions",
    },
  },
  FOLLOW_US: {
    TEXT:{
      TITLE: "Follow",
      TEXT: "SPS SPICES AND DRY FRUITS",
      TEXT_2: "on social networks:",
    },
    SOCIAL_MEDIA: {
      INSTAGRAM: "https://www.instagram.com/sps_spices/",
      WHATSAPP: "https://wa.me/917092597277",
      YOUTUBE: "https://www.youtube.com/@spsspices",
      FACEBOOK: "https://www.facebook.com/spsspices",
      TWITTER: "https://www.twitter.com/spsspices",
      },
  },
  COPYRIGHT: {
    TEXT: {
      YEAR: "© 2025",
      BRAND_NAME: "spsspicesanddryfruits. All Rights Reserved",
    },
  },
  DESIGNED_AND_DEVELOPED_BY: {
    TEXT: "Designed and Developed by",
    LINK: "https://pragantechsolutions.com/",
    LINK_TEXT: "Pragan Tech Solutions",
  },
}

// Titles
export const TITLES = {
  PRODUCTS: {
    TITLE: "Products",
    DESCRIPTION: "Royal Spices. Refined Taste. Pure, carefully sourced spices crafted to elevate everyday cooking into an experience of elegance.",
  },
  COLLECTIONS: {
    TITLE: "Collections",
    DESCRIPTION: "A signature collection of premium spice blends, crafted with precision and tradition. Each blend delivers depth, aroma, and balance — created for kitchens that demand nothing but the finest.",
  },
  RECENT_PRODUCTS: {
    TITLE: {
      TEXT: "Latest",
      TEXT_2: "Products",
    },
    DESCRIPTION: "Discover our latest spice blends, carefully crafted with precision and tradition. Each blend delivers depth, aroma, and balance — created for kitchens that demand nothing but the finest.",
  },
  WISHLIST: {
    TITLE: "My Wishlist",
    DESCRIPTION: "Your curated collection of premium spice blends, crafted with precision and tradition. Each blend delivers depth, aroma, and balance — created for kitchens that demand nothing but the finest.",
  },
  MY_ORDERS: {
    TITLE: "My Orders",
    ORDER_ITEMS: "Order Items",
    ORDER_SUMMARY: "Order Summary",
    SHIPPING_ADDRESS: "Shipping Address",
    DESCRIPTION: "Your orders, carefully crafted with precision and tradition. Each blend delivers depth, aroma, and balance — created for kitchens that demand nothing but the finest.",
  },
}