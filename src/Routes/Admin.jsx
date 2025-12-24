import React from 'react'
import { UseAdminSidebar } from '../contexts/AdminSidebarContext';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../lib/constant';
import AdminHeader from '../Components/AdminHeader';

import AdminAddProduct from '../Pages/Admin/AdminAddProduct';
import Customers from '../Pages/Admin/Customers';
import Orders from '../Pages/Admin/Orders';
import Collections from '../Pages/Admin/Collections';
import Products from '../Pages/Admin/Products';
import AdminAddCollection from '../Pages/Admin/AdminAddCollection';
import ProductDetails from '../Pages/User/ProductDetails';
import AdminAddCustomer from '../Pages/Admin/AdminAddCustomer';

function Admin() {
    const { isCollapsed } = UseAdminSidebar();
    
    return (
      <>
        <AdminHeader />
        <main 
          className={`grow transition-all duration-300 ${
            isCollapsed ? "lg:ml-20" : "lg:ml-60"
          }`}
        >
          <div className="p-4 sm:p-6 md:p-8">
            <Routes>
              <Route path={ROUTES.ADMIN_ADD_PRODUCT} element={<AdminAddProduct />} />
              <Route path={ROUTES.ADMIN_PRODUCTS} element={<Products />} />
              <Route path={ROUTES.ADMIN_CUSTOMERS} element={<Customers />} />
              <Route path={ROUTES.ADMIN_ADD_CUSTOMER} element={<AdminAddCustomer />} />
              <Route path={ROUTES.ADMIN_ORDERS} element={<Orders />} />
              <Route path={ROUTES.ADMIN_COLLECTIONS} element={<Collections />} />
              <Route path={ROUTES.ADMIN_ADD_COLLECTION} element={<AdminAddCollection />} />
              <Route path={`${ROUTES.ADMIN_PRODUCT_DETAILS}/:id`} element={<ProductDetails userPage={false} />} />
            </Routes>
          </div>
        </main>
      </>
    );
  }

export default Admin;
