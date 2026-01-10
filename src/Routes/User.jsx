import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../lib/constant';
import Home from '../Pages/User/Home';
import AboutUs from '../Pages/User/AboutUs';
import Contact from '../Pages/User/Contact';
import Products from '../Pages/User/Products';
import ProductDetails from '../Pages/User/ProductDetails';
import Collections from '../Pages/User/Collections';
import CollectionProducts from '../Pages/User/CollectionProducts';
import AddToWishlist from '../Pages/User/AddToWishlist';
import Cart from '../Pages/User/Cart';
import MyOrders from '../Pages/User/MyOrders';
import PaymentPage from '../Pages/User/PaymentPage';
import MyProfile from '../Pages/User/MyProfile';
import TopSellingProducts from '../Pages/User/TopSellingProducts';
import AmazonProducts from '../Pages/User/AmazonProducts';
import FlipkartProducts from '../Pages/User/FlipkartProducts';
import ProtectedRoutes from '../Components/Routes/ProtectedRoutes';
import PageNotFound from '../Components/PageNotFound';

function User() {
  return (
    <main className="grow">
    <Routes>
      {/* Remove Protected Routes from home page */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.ABOUT} element={<ProtectedRoutes />}>
        <Route index element={<AboutUs />} />
      </Route>
      <Route path={ROUTES.CONTACT} element={<ProtectedRoutes />}>
        <Route index element={<Contact />} />
      </Route>
      <Route path={ROUTES.PRODUCTS} element={<Products />}>
      </Route>
      <Route path={`${ROUTES.PRODUCT_DETAILS}/:id`} element={<ProtectedRoutes />}>
        <Route index element={<ProductDetails userPage={true} />} />
      </Route>
      <Route path={ROUTES.COLLECTIONS} element={<ProtectedRoutes />}>
        <Route index element={<Collections />} />
      </Route>
      <Route path={`${ROUTES.COLLECTION_PRODUCTS}/:id`} element={<ProtectedRoutes />}>
        <Route index element={<CollectionProducts />} />
      </Route>
      <Route path={ROUTES.ADD_TO_WISHLIST} element={<ProtectedRoutes />}>
        <Route index element={<AddToWishlist />} />
      </Route>
      <Route path={ROUTES.CART} element={<ProtectedRoutes />}>
        <Route index element={<Cart />} />
      </Route>
      <Route path={ROUTES.MY_ORDERS} element={<ProtectedRoutes />}>
        <Route index element={<MyOrders />} />
      </Route>
      <Route path={ROUTES.PAYMENT} element={<ProtectedRoutes />}>
        <Route index element={<PaymentPage />} />
      </Route>
      <Route path={ROUTES.MY_PROFILE} element={<ProtectedRoutes />}>
        <Route index element={<MyProfile />} />
      </Route>
      <Route path={ROUTES.TOP_SELLING_PRODUCTS} element={<TopSellingProducts />} />
      <Route path={ROUTES.AMAZON_PRODUCTS} element={<AmazonProducts />} />
      <Route path={ROUTES.FLIPKART_PRODUCTS} element={<FlipkartProducts />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>

  </main>
  )
}

export default User
