import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../lib/constant';
import Login from '../Pages/Common/Login';
import Register from '../Pages/Common/Register';
import PageNotFound from '../Components/PageNotFound';

function Common() {
  return (
    <main className="grow">
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </main>
  )
}

export default Common
