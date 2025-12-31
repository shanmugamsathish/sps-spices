import React from 'react'
import { UseAdminSidebar } from '../contexts/AdminSidebarContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from '../lib/constant';
import AdminHeader from '../Components/AdminHeader';
import ProtectedRoutes from '../Components/Routes/ProtectedRoutes';

import AdminAddProduct from '../Pages/Admin/AdminAddProduct';
import Customers from '../Pages/Admin/Customers';
import Orders from '../Pages/Admin/Orders';
import Collections from '../Pages/Admin/Collections';
import Products from '../Pages/Admin/Products';
import AdminAddCollection from '../Pages/Admin/AdminAddCollection';
import ProductDetails from '../Pages/User/ProductDetails';
import AdminAddCustomer from '../Pages/Admin/AdminAddCustomer';
import AdminLogin from '../Pages/Common/AdminLogin';
import PageNotFound from '../Components/PageNotFound';

function Admin() {
    const { isCollapsed } = UseAdminSidebar();
    const location = useLocation();
    
    return (
      <>
        <Routes>
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        </Routes>
        {location.pathname !== ROUTES.ADMIN_LOGIN && <AdminHeader />}
        {location.pathname !== ROUTES.ADMIN_LOGIN && (
          <main
            className={`grow transition-all duration-300 ${
              isCollapsed ? "lg:ml-20" : "lg:ml-60"
            }`}
          >
            <div className="p-4 sm:p-6 md:p-8">
              <Routes>
                <Route element={<ProtectedRoutes />}>
                  <Route path={ROUTES.ADMIN_ADD_PRODUCT} element={<AdminAddProduct />} />
                  <Route path={ROUTES.ADMIN_PRODUCTS} element={<Products />} />
                  <Route path={ROUTES.ADMIN_CUSTOMERS} element={<Customers />} />
                  <Route path={ROUTES.ADMIN_ADD_CUSTOMER} element={<AdminAddCustomer />} />
                  <Route path={ROUTES.ADMIN_ORDERS} element={<Orders />} />
                  <Route path={ROUTES.ADMIN_COLLECTIONS} element={<Collections />} />
                  <Route path={ROUTES.ADMIN_ADD_COLLECTION} element={<AdminAddCollection />} />
                  <Route path={`${ROUTES.ADMIN_PRODUCT_DETAILS}/:id`} element={<ProductDetails userPage={false} />} />
                  <Route path="*" element={<PageNotFound />} />
                </Route>
              </Routes>
            </div>
          </main>
        )}
      </>
    );
  }

export default Admin;
