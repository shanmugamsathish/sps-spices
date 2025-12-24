import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CircleUserRound, ShoppingCart, HeartPlus, Menu, X, } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "../assets/LOGO sps.jpg";
import theme from "../lib/theme";
import { getProductByTitle, getAllProducts } from "../apiCalls/products";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/productSlice";

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dispatch = useDispatch();
  const isActive = (path) => location.pathname === path;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearch = async (e) => {
    const query = e.target.value.trim();
    
    if (!query) {
      try {
        const allProducts = await getAllProducts();
        if(allProducts) {
          const productsArray = Array.isArray(allProducts) ? allProducts : [];
          console.log(productsArray);
          dispatch(setProducts(productsArray));
        } else {
          dispatch(setProducts([]));
        }
      } catch (error) {
        console.error('Error fetching all products:', error);
        dispatch(setProducts([]));
      }
      return;
    }
    
    try {
      const response = await getProductByTitle(query);
      let products = [];
      if (response?.product) {
        products = Array.isArray(response.product) ? response.product : [response.product];
      } else if (response?.products) {
        products = Array.isArray(response.products) ? response.products : [];
      } else if (Array.isArray(response)) {
        products = response;
      }
      
      dispatch(setProducts(products));
    } catch (error) {
      console.error('Error searching products:', error);
      dispatch(setProducts([]));
    }
  }

  return (
    <header
      className="w-full shadow-sm sticky top-0 z-50"
      style={{
        backgroundColor: theme.colors.background.main,
        color: theme.colors.text.primary,
      }}
    >
      <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 md:py-4">
        {/* Logo Section - Fixed Width (Responsive) */}
        <div className="flex items-center justify-start shrink-0" style={{ 
          width: 'clamp(5rem, 8vw, 10rem)', 
          minWidth: '5rem',
          maxWidth: '10rem'
        }}>
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
          />
        </div>

        {/* Desktop Navigation - Fixed Width (Responsive) */}
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 2xl:gap-4 shrink-0" style={{ 
          width: 'clamp(24rem, 40vw, 32rem)', 
          minWidth: '24rem',
          maxWidth: '32rem'
        }}>
          <Link
            to="/"
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
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
          >
            HOME
          </Link>
          <Link
            to="/about"
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
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
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
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
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
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

        {/* Icons Section - Fixed Width (Responsive) with Permanent Search Input */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-6 shrink-0" style={{ 
          width: 'clamp(8rem, 12vw, 14rem)', 
          minWidth: '8rem',
          maxWidth: '14rem',
          position: 'relative'
        }}>
          {/* Search Section - Permanently positioned within fixed width */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-4" style={{ width: '100%', maxWidth: '100%' }}>
            {isSearchOpen ? (
              <div className="flex items-center gap-1 sm:gap-2 w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e);
                  }}
                  className="flex-1 h-7 sm:h-8 md:h-9 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border focus:outline-none focus:ring-2 transition-all text-xs sm:text-sm"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                    minWidth: 0,
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                    try {
                      const allProducts = await getAllProducts();
                      const productsArray = Array.isArray(allProducts) ? allProducts : [];
                      dispatch(setProducts(productsArray));
                    } catch (error) {
                      console.error('Error fetching all products:', error);
                    }
                  }}
                  className="p-0.5 sm:p-1 rounded-md hover:opacity-70 transition-opacity shrink-0"
                  style={{ color: theme.colors.text.secondary }}
                  aria-label="Close search"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <Search 
                onClick={() => setIsSearchOpen(true)} 
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity shrink-0" 
                style={{ color: theme.colors.text.primary }}
                aria-label="Open search"
              />
            )}
          </div>
          <CircleUserRound 
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity shrink-0" 
            style={{ color: theme.colors.text.primary }}
          />
          <ShoppingCart 
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity shrink-0" 
            style={{ color: theme.colors.text.primary }}
          />
          <HeartPlus 
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity hidden sm:block shrink-0" 
            style={{ color: theme.colors.text.primary }}
          />
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-1 sm:p-1.5 rounded-md hover:opacity-70 transition-opacity shrink-0"
            style={{ color: theme.colors.text.primary }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
            onClick={() => setIsMenuOpen(false)}
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
            onClick={() => setIsMenuOpen(false)}
          >
            PRODUCTS
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
