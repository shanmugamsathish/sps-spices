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
import Loader from '../Components/Loader';
import Login from '../Pages/Common/Login';
import Register from '../Pages/Common/Register';
import ProtectedRoutes from '../Components/Routes/ProtectedRoutes';
import PageNotFound from '../Components/PageNotFound';

function User() {
  return (
    <main className="grow">
    <Routes>
      <Route path={ROUTES.HOME} element={<ProtectedRoutes />}>
        <Route index element={<Home />} />
      </Route>
      <Route path={ROUTES.ABOUT} element={<ProtectedRoutes />}>
        <Route index element={<AboutUs />} />
      </Route>
      <Route path={ROUTES.CONTACT} element={<ProtectedRoutes />}>
        <Route index element={<Contact />} />
      </Route>
      <Route path={ROUTES.PRODUCTS} element={<ProtectedRoutes />}>
        <Route index element={<Products />} />
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
      <Route path="*" element={<PageNotFound />} />
    </Routes>

  </main>
  )
}

export default User
