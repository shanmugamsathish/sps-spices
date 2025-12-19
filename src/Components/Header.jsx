import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CircleUserRound, ShoppingCart, HeartPlus, Menu, X, } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "../assets/LOGO sps.jpg";
import theme from "../lib/theme";

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header
      className="w-full shadow-sm sticky top-0 z-50"
      style={{
        backgroundColor: theme.colors.background.main,
        color: theme.colors.text.primary,
      }}
    >
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 md:py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          <Link
            to="/"
            className="px-2 py-1 rounded-md"
            style={
              isActive("/")
                ? {
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }
                : { color: theme.colors.text.primary }
            }
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="px-2 py-1 rounded-md"
            style={
              isActive("/about")
                ? {
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }
                : { color: theme.colors.text.primary }
            }
          >
            ABOUT US
          </Link>
          <Link
            to="/products"
            className="px-2 py-1 rounded-md"
            style={
              isActive("/products")
                ? {
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }
                : { color: theme.colors.text.primary }
            }
          >
            PRODUCTS
          </Link>
          <Link
            to="/contact"
            className="px-2 py-1 rounded-md"
            style={
              isActive("/contact")
                ? {
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }
                : { color: theme.colors.text.primary }
            }
          >
            CONTACT
          </Link>
        </nav>

        {/* Icons Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:opacity-70 transition-opacity" />
          <CircleUserRound className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:opacity-70 transition-opacity" />
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:opacity-70 transition-opacity" />
          <HeartPlus className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:opacity-70 transition-opacity hidden sm:block" />
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden ml-2 p-1"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="px-4 pb-4 space-y-2 border-t"
          style={{
            backgroundColor: theme.colors.background.main,
            color: theme.colors.text.primary,
          }}
        >
          <Link
            to="/"
            className="block py-2 px-3 rounded-md transition-colors"
            style={
              isActive("/")
                ? {
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }
                : { color: theme.colors.text.primary }
            }
            onClick={() => setIsMenuOpen(false)}
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="block py-2 px-3 rounded-md transition-colors"
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
            className="block py-2 px-3 rounded-md transition-colors"
            style={
              isActive("/products")
                ? {
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }
                : { color: theme.colors.text.primary }
            }
            onClick={() => setIsMenuOpen(false)}
          >
            PRODUCTS
          </Link>
          <Link
            to="/contact"
            className="block py-2 px-3 rounded-md transition-colors"
            style={
              isActive("/contact")
                ? {
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }
                : { color: theme.colors.text.primary }
            }
            onClick={() => setIsMenuOpen(false)}
          >
            CONTACT
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
