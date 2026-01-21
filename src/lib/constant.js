
// API URL
export const API_URL = 'http://localhost:7777/api';

// Logo Images
import logo from '../assets/LOGO sps.jpg';
import logoWhite from '../assets/LOGO sps bg.png';
import login from '../assets/login.png';
import register from '../assets/register.png';
import pageNotFound from '../assets/page-not-found.png';
import masterVideo from '../assets/masterVideo.mp4';

// About Us Images
import aboutUsImage from '../assets/AboutUs.png';

// Reviews Images
import profilepic1 from "../assets/profilepic1.png";
import profilepic2 from "../assets/profilepic2.png";
import profilepic3 from "../assets/profilepic3.png";
import profilepic4 from "../assets/profilepic4.png";
import profilepic5 from "../assets/profilepic5.png";
import profilepic6 from "../assets/profilepic6.png";

// Product menu Images
import Spices from '../assets/Spicess.jpg';
import DryFruits from '../assets/DryFruits.jpg';
import TopSeller from '../assets/TopSeller.jpg';
import DailyDeals from '../assets/DailyDeals.jpg';

// Routes
export const ROUTES = {
  TERMS_AND_CONDITION: '/terms-and-condition',
  PRIVACY_POLICY: '/privacy-policy',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  HOME: '/',
  MY_PROFILE: '/my-profile',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRODUCTS: '/products',
  TOP_SELLING_PRODUCTS: '/top-selling-products',
  AMAZON_PRODUCTS: '/amazon-products',
  FLIPKART_PRODUCTS: '/flipkart-products',
  PRODUCT_DETAILS: '/product-details',
  COLLECTIONS: '/collections',
  COLLECTION_PRODUCTS: '/collection-products',
  ADD_TO_WISHLIST: '/add-to-wishlist',
  CART: '/cart',
  MY_ORDERS: '/my-orders',
  PAYMENT: '/payment',

  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_LIST: '/admin/product-list',
  ADMIN_ADD_PRODUCT: '/admin/add-product',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_ADD_CUSTOMER: '/admin/add-customer',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_COLLECTIONS: '/admin/collections',
  ADMIN_ADD_COLLECTION: '/admin/add-collection',
  ADMIN_PRODUCT_DETAILS: '/admin/product-details',
  ADMIN_AMAZON_PRODUCTS: '/admin/amazon-products',
  ADMIN_FLIPKART_PRODUCTS: '/admin/flipkart-products',
  ADMIN_GST_SETTINGS: '/admin/gst-settings',
  ADMIN_EDIT_BANNER_IMAGES: '/admin/edit-banner-images',
}

// About Us Images
export const ABOUT_US_IMAGES = {
  ABOUT_US_IMAGE: aboutUsImage,
}

// Logo Images
export const LOGO = {
  LOGO: logo,
  LOGO_WHITE: logoWhite,
  LOGIN: login,
  REGISTER: register,
  MASTER_VIDEO: masterVideo,
}

// Page Not Found Images
export const PAGE_NOT_FOUND = {
  PAGE_NOT_FOUND: pageNotFound,
}

// Product menu Images
export const PRODUCT_MENU_IMAGES = {
  SPICES: Spices,
  DRY_FRUITS: DryFruits,
  TOP_SELLER: TopSeller,
  DAILY_DEALS: DailyDeals,
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
    TEXT: {
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

// About Us
export const ABOUT_US = {
  TITLE: "SPS Spices & Dry Fruits",
  SUB_TITLE: {
    TEXT: "Royal Spices",
    TEXT_2: "Premium Dry Fruits",
    TEXT_3: "Refined Taste",
  },
  DESCRIPTION1: "Pure, carefully sourced spices crafted to elevate everyday cooking into an experience of elegance. Rooted in tradition and refined through modern craftsmanship, every product reflects our commitment to purity, consistency, and timeless taste.",
  DESCRIPTION2: "From premium-grade spices to hand-selected dry fruits, our collections are curated to serve homes, chefs, and culinary enthusiasts who value authenticity, aroma, and balanced flavor.",
  TRUST_LINE: "The Trusted Choice for Authentic Spices and Exquisite Dry Fruits.",
}

// Reviews
export const REVIEWS = [
  {
    profilepic: profilepic3,
    name: "Rajesh K",
    title: "Good Quality Spices",
    text: "I bought black pepper, cloves and cardamom. Spices are fresh and smell very nice. Happy with the purchase.",
  },
  {
    profilepic: profilepic2,
    name: "Arun Kumar",
    title: "சுத்தமான பேக்கிங் - புதிய பொருட்கள்",
    text: "பொருட்கள் சுத்தமாகவும் நன்றாக பேக் செய்யப்பட்டும் உள்ளன. வீட்டில் தயாரிக்கப்பட்ட மசாலாப் பொருட்கள் போல இருக்குது.",
  },
  {
    profilepic: profilepic1,
    name: "Priya R",
    title: "Good Dry Fruits for Daily Use",
    text: "Bought almonds, cashew and raisins. Dry fruits are fresh and crunchy. Worth the money.",
  },
  {
    profilepic: profilepic5,
    name: "Santhosh M",
    title: "Good Quality",
    text: "Purchased dried ginger, garlic and nutmeg. Using it for cooking. Taste is good and quality is nice.",
  },
  {
    profilepic: profilepic4,
    name: "Nisha K",
    title: "Kids Liked It",
    text: "Ordered pista and dried fruits like apricot and mango. Very soft and fresh. My kids liked it a lot.",
  },
  {
    profilepic: profilepic6,
    name: "Rahul A",
    title: "Good Kerala Spices",
    text: "Bought Marayoor jaggery and cardamom. Natural taste and good flavour. Will buy again.",
  },
];

export const PRIVACY_POLICY = {
  TITLE: "Privacy Policy",
  DESCRIPTION:
    "Your privacy is important to us. This policy explains how we collect, use, and protect your data when you use our e-commerce platform.",

  POLICIES: [
    {
      title: "Information We Collect",
      text: "We collect personal details such as name, email, phone number, delivery address, and payment-related information to process your orders."
    },
    {
      title: "How We Use Your Information",
      text: "Your data is used for order processing, customer support, delivery updates, and improving your shopping experience."
    },
    {
      title: "Data Security",
      text: "We use secure servers and encryption methods to protect your personal information from unauthorized access."
    },
    {
      title: "Sharing of Information",
      text: "We do not sell your personal data. Information is only shared with delivery partners and payment gateways for order fulfillment."
    },
    {
      title: "Cookies",
      text: "We use cookies to enhance site performance, remember your preferences, and analyze user behavior."
    },
    {
      title: "Your Rights",
      text: "You can request access, correction, or deletion of your personal data by contacting our support team."
    },
  ],

  FOOTER:
    "By using our website, you agree to the terms of this Privacy Policy.",
};