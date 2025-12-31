import Image1 from '../assets/Image1.png';
import Image2 from '../assets/Image2.png';
import Image3 from '../assets/Image3.png';
import Image4 from '../assets/Image4.png';
import Image5 from '../assets/Image5.png';
import Image6 from '../assets/Image6.png';

import logo from '../assets/LOGO sps.jpg';
import logoWhite from '../assets/LOGO sps bg.png';
import login from '../assets/login.png';
import register from '../assets/register.png';
import pageNotFound from '../assets/page-not-found.png';

export const API_URL = 'http://localhost:7777/api';

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

    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_ADD_PRODUCT: '/admin/add-product',
    ADMIN_CUSTOMERS: '/admin/customers',
    ADMIN_ADD_CUSTOMER: '/admin/add-customer',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_COLLECTIONS: '/admin/collections',
    ADMIN_ADD_COLLECTION: '/admin/add-collection',
    ADMIN_PRODUCT_DETAILS: '/admin/product-details',
}

export const HERO_SECTION_IMAGES = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
]

export const HERO_SECTION_DURATION = 60;

export const LOGO = {
    LOGO: logo,
    LOGO_WHITE: logoWhite,
    LOGIN: login,
    REGISTER: register,
}

export const PAGE_NOT_FOUND = {
    PAGE_NOT_FOUND: pageNotFound,
}

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