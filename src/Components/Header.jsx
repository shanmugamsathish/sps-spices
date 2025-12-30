import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CircleUserRound,
  ShoppingCart,
  HeartPlus,
  Menu,
  X,
  TruckIcon,
  UserRoundPenIcon,
  LogOutIcon,
  CircleUserRoundIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "../assets/LOGO sps.jpg";
import dryFruits from "../assets/login.png";
import wholeSpices from "../assets/adminLogin.png";
import theme from "../lib/theme";
import { getProductByTitle, getAllProducts } from "../apiCalls/products";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DialogBox from "./DialogBox";
import EditCustomerModal from "./AdminEditCustomer/EditCustomerModel";
import { getUserProfile } from "../apiCalls/users";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  console.log(user);
  const isActive = (path) => location.pathname === path;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const handleLogout = () => {
    try {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("shopifyAccessToken");
      navigate("/login");
      dispatch(setUser(null));
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    } finally {
      setShowUserMenu(false);
    }
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await getUserProfile();
      if (response?.success) {
        dispatch(setUser(response.customer));
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      toast.error("Error getting user profile");
    }
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value.trim();

    if (!query) {
      try {
        const allProducts = await getAllProducts();
        if (allProducts) {
          const productsArray = Array.isArray(allProducts) ? allProducts : [];
          console.log(productsArray);
          dispatch(setProducts(productsArray));
        } else {
          dispatch(setProducts([]));
        }
      } catch (error) {
        console.error("Error fetching all products:", error);
        dispatch(setProducts([]));
      }
      return;
    }

    try {
      const response = await getProductByTitle(query);
      let products = [];
      if (response?.product) {
        products = Array.isArray(response.product)
          ? response.product
          : [response.product];
      } else if (response?.products) {
        products = Array.isArray(response.products) ? response.products : [];
      } else if (Array.isArray(response)) {
        products = response;
      }

      dispatch(setProducts(products));
    } catch (error) {
      console.error("Error searching products:", error);
      dispatch(setProducts([]));
    }
  };

  // Close dropdowns when clicking/touching outside
  useEffect(() => {
    function handleDocClick(e) {
      if (showUserMenu && userMenuRef.current) {
        if (!userMenuRef.current.contains(e.target)) {
          setShowUserMenu(false);
        }
      }
    }

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("touchstart", handleDocClick);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("touchstart", handleDocClick);
    };
  }, [showUserMenu]);

  // Refresh list and close modal after an update from child modal
  const handleCustomerUpdate = useCallback(() => {
    setIsEditCustomerModalOpen(false);
    fetchUserProfile();
  }, [fetchUserProfile]);

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
        <div
          className="flex items-center justify-start shrink-0"
          style={{
            width: "clamp(5rem, 8vw, 10rem)",
            minWidth: "5rem",
            maxWidth: "10rem",
          }}
        >
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
          />
        </div>

        {/* Desktop Navigation - Fixed Width (Responsive) */}
        <nav
          className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 2xl:gap-4 shrink-0"
          style={{
            width: "clamp(24rem, 40vw, 32rem)",
            minWidth: "24rem",
            maxWidth: "32rem",
          }}
        >
          <Link
            to="/"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            className=" px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
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
            onClick={() => {
              window.scrollTo(0, 0);
            }}
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
          <div className="relative group">
            <Link
              to="/products"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
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

            {/* Hover dropdown for product categories */}
            <div
              className="absolute left-0 mt-2 w-56 rounded-md shadow-lg opacity-0 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto z-50"
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <div className="flex flex-col gap-4 p-2">
                <Link
                  to="/products"
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
                  to="/products"
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
          <Link
            to="/collections"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
            style={
              isActive("/collections")
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
        <div
          className="flex items-center justify-end gap-1 sm:gap-2 md:gap-6 shrink-0"
          style={{
            width: "clamp(8rem, 12vw, 14rem)",
            minWidth: "8rem",
            maxWidth: "14rem",
            position: "relative",
          }}
        >
          {/* Search Section - Permanently positioned within fixed width */}
          <div
            className="flex items-center gap-1 sm:gap-3 md:gap-4"
            style={{ width: "100%", maxWidth: "100%" }}
          >
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
                    if (e.key === "Escape") {
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
                      const productsArray = Array.isArray(allProducts)
                        ? allProducts
                        : [];
                      dispatch(setProducts(productsArray));
                    } catch (error) {
                      console.error("Error fetching all products:", error);
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
          <HeartPlus
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity hidden sm:block shrink-0"
            style={{ color: theme.colors.text.primary }}
          />
          <ShoppingCart
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity shrink-0"
            style={{ color: theme.colors.text.primary }}
          />
          <div className="relative group">
            <CircleUserRound
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity shrink-0"
              style={{ color: theme.colors.text.primary }}
              onClick={() => setShowUserMenu(true)}
            />

            {/* Hover dropdown for user */}
            <div
              ref={userMenuRef}
              className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg transition-all duration-150 z-50  ${
                showUserMenu
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <div className="flex flex-col gap-2 p-2">
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2 border-b border-gray-300 pb-2">
                    <CircleUserRoundIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <p className="text-sm font-medium">
                      Welcome, <span className="font-bold">{user?.firstName}</span>
                    </p>
                  </div>
                </div>
                <Link
                  to="/orders"
                  className="px-4 py-2 text-sm hover:bg-gray-300 transition-colors border-t border-gray-100"
                  style={{ color: theme.colors.text.primary }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setShowUserMenu(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <p className="text-md font-medium">My orders</p>
                  </div>
                </Link>
                <button
                  type="button"
                  className="px-4 py-2 text-sm hover:bg-gray-300 transition-colors border-t border-gray-100"
                  style={{ color: theme.colors.text.primary }}
                  onClick={() => {
                    setIsEditCustomerModalOpen(true);
                    setShowUserMenu(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <UserRoundPenIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <p className="text-md font-medium">Edit Profile</p>
                  </div>
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-300 transition-colors border-t border-gray-100"
                  style={{ color: theme.colors.text.primary }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setShowUserMenu(false);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <LogOutIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    <p className="text-md font-medium">Logout</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
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
      <EditCustomerModal
        customerId={user?.id}
        isOpen={isEditCustomerModalOpen}
        onClose={() => setIsEditCustomerModalOpen(false)}
        onUpdate={handleCustomerUpdate}
        title="Edit Profile"
      />
      <DialogBox
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Logout"
        description="Are you sure you want to logout?"
        onConfirm={handleLogout}
      />
    </header>
  );
}

export default Header;
