import React from 'react'
import { Link } from 'react-router-dom';
import theme from '../../lib/theme';
import dryFruits from '../../assets/login.png';
import wholeSpices from '../../assets/adminLogin.png';
import allProducts from '../../assets/spicesanddryFruits.jpg';
import { ROUTES } from '../../lib/constant';

function Desktop({ isActive, isHeader, token, shopifyAccessToken }) {
  
  return (
    <nav
    className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 2xl:gap-4 shrink-0"
    style={{
      width: "clamp(24rem, 40vw, 32rem)",
      minWidth: "24rem",
      maxWidth: "32rem",
    }}
  >
    <Link
      to={ROUTES.HOME}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className=" px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
      style={
        isActive(ROUTES.HOME)
          ? {
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.main,
            }
          : {
              color: theme.colors.text.primary,
            }
      }
    >
      HOME
    </Link>
    <Link
      to={ROUTES.ABOUT}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
      style={
        isActive(ROUTES.ABOUT)
          ? {
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.main,
            }
          : { color: theme.colors.text.primary }
      }
    >
      ABOUT US
    </Link>
    {isHeader && !token && !shopifyAccessToken && (
      <>
    <Link
      to={ROUTES.TERMS_AND_CONDITION}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
    >
      TERMS
    </Link>
    <Link
      to={ROUTES.PRIVACY_POLICY}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
    >
      PRIVACY POLICY
    </Link>
    <Link
      to={ROUTES.CONTACT}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
    >
      CONTACT
    </Link>
    </>
    )}

    
    {(!isHeader || (isHeader && token && shopifyAccessToken)) && (
      <>
    <div className="relative group">
      <Link
        to={ROUTES.PRODUCTS}
        onClick={() => {
          window.scrollTo(0, 0);
        }}
        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
        style={
          isActive(ROUTES.PRODUCTS)
            ? {
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }
            : { color: theme.colors.text.primary }
        }
      >
        PRODUCTS
      </Link>

      {/* Hover dropdown for product categories */}
      <div
        className="absolute left-0 mt-2 w-56 rounded-md shadow-lg opacity-0 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto z-50"
        style={{
          backgroundColor: theme.colors.background.main,
          border: `1px solid ${theme.colors.border.light}`,
        }}
      >
        <div className="flex flex-col gap-4 p-2">
          {/* Link to all products */}
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.PRODUCTS}
              className="px-4 py-2 text-sm hover:bg-gray-300 transition-colors border-b border-gray-300"
              style={{ color: theme.colors.text.primary }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="flex items-center gap-2">
                <img src={allProducts} alt="all-products" className="w-8 h-8" />
                <p className="text-md font-medium">All Products</p>
              </div>
            </Link>
          </div>
          <Link
            to={ROUTES.PRODUCTS}
            state={{ section: "dry-fruits" }}
            className="px-4 py-2 text-sm hover:bg-gray-300 transition-colors border-b border-gray-300"
            style={{ color: theme.colors.text.primary }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="flex items-center gap-2 ">
              <img src={dryFruits} alt="dry-fruits" className="w-8 h-8" />
              <p className="text-md font-medium">Dry Fruits</p>
            </div>
          </Link>
          <Link
            to={ROUTES.PRODUCTS}
            state={{ section: "whole-spices" }}
            className="px-4 py-2 text-sm hover:bg-gray-300 transition-colors border-b border-gray-300"
            style={{ color: theme.colors.text.primary }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="flex items-center gap-2">
              <img
                src={wholeSpices}
                alt="whole-spices"
                className="w-8 h-8"
              />
              <p className="text-md font-medium">Whole Spices</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
    </>
    )}
    {(!isHeader || (isHeader && token && shopifyAccessToken)) && (
      <>
    <Link
      to={ROUTES.COLLECTIONS}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
      style={
        isActive(ROUTES.COLLECTIONS)
          ? {
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.main,
            }
          : { color: theme.colors.text.primary }
      }
    >
      COLLECTIONS
    </Link>
    <Link
      to={ROUTES.CONTACT}
      className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
      style={
        isActive(ROUTES.CONTACT)
          ? {
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.main,
            }
          : { color: theme.colors.text.primary }
      }
    >
      CONTACT
    </Link>
    </>
    )}
  </nav>
  )
}

export default Desktop
