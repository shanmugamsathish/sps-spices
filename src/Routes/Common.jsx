import React from 'react'
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../lib/constant';
import Login from '../Pages/Common/Login';
import Register from '../Pages/Common/Register';
import TermsAndCondition from '../Pages/User/TermsAndCondition';
import PrivacyPolicy from '../Pages/User/PrivacyPolicy';
import PageNotFound from '../Components/PageNotFound';

function Common() {
  return (
    <main className="grow">
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.TERMS_AND_CONDITION} element={<TermsAndCondition />} />
      <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicy />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </main>
  )
}

export default Common
