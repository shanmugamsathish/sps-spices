import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../lib/constant';
import Home from '../Pages/User/Home';
import AboutUs from '../Pages/User/AboutUs';
import Contact from '../Pages/User/Contact';
import Products from '../Pages/User/Products';
import ProductDetails from '../Pages/User/ProductDetails';
import Loader from '../Components/Loader';
import Login from '../Pages/Common/Login';
import Register from '../Pages/Common/Register';

function User() {
  return (
    <main className="grow">
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.ABOUT} element={<AboutUs />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.PRODUCTS} element={<Products />} />
      <Route path={`${ROUTES.PRODUCT_DETAILS}/:id`} element={<ProductDetails userPage={true} />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
    </Routes>
  </main>
  )
}

export default User
