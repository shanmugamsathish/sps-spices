import React from 'react'
import theme from '../../lib/theme';
import { Link } from 'react-router-dom';

function Mobile({ isMenuOpen, setIsMenuOpen, isActive }) {
  return (
    <nav
    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
      isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    }`}
    style={{
      borderTop: `1px solid ${theme.colors.border.light}`,
    }}
  >
    <div
      className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-1 sm:space-y-2"
      style={{
        backgroundColor: theme.colors.background.main,
        color: theme.colors.text.primary,
      }}
    >
      <Link
        to="/"
        className="block py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition-colors text-sm sm:text-base font-medium"
        style={
          isActive("/")
            ? {
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }
            : {
                color: theme.colors.text.primary,
              }
        }
        onClick={() => {
          setIsMenuOpen(false);
          window.scrollTo(0, 0);
        }}
      >
        HOME
      </Link>
      <Link
        to="/about"
        className="block py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition-colors text-sm sm:text-base font-medium"
        style={
          isActive("/about")
            ? {
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }
            : { color: theme.colors.text.primary }
        }
        onClick={() => setIsMenuOpen(false)}
      >
        ABOUT US
      </Link>
      <Link
        to="/products"
        className="block py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition-colors text-sm sm:text-base font-medium"
        style={
          isActive("/products")
            ? {
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }
            : { color: theme.colors.text.primary }
        }
        onClick={() => {
          setIsMenuOpen(false);
          window.scrollTo(0, 0);
        }}
      >
        PRODUCTS
      </Link>
      <Link
        to="/collections"
        className="block py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition-colors text-sm sm:text-base font-medium"
        style={
          isActive("/collections")
            ? {
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }
            : { color: theme.colors.text.primary }
        }
        onClick={() => {
          setIsMenuOpen(false);
          window.scrollTo(0, 0);
        }}
      >
        COLLECTIONS
      </Link>
      <Link
        to="/contact"
        className="block py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition-colors text-sm sm:text-base font-medium"
        style={
          isActive("/contact")
            ? {
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.main,
              }
            : { color: theme.colors.text.primary }
        }
        onClick={() => {
          setIsMenuOpen(false);
          window.scrollTo(0, 0);
        }}
      >
        CONTACT
      </Link>
    </div>
  </nav>
  )
}

export default Mobile
