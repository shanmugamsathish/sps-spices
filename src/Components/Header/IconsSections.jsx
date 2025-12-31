import React from "react";
import theme from "../../lib/theme";
import { Link } from "react-router-dom";
import {
  X,
  Search,
  HeartPlus,
  ShoppingCart,
  CircleUserRound,
  CircleUserRoundIcon,
  TruckIcon,
  UserRoundPenIcon,
  LogOutIcon,
  Menu,
} from "lucide-react";

function IconsSections({
  isSearchOpen,
  setSearchQuery,
  handleSearch,
  setIsSearchOpen,
  searchQuery,
  dispatch,
  setProducts,
  getAllProducts,
  navigate,
  ROUTES,
  cartItemsCount,
  user,
  setShowUserMenu,
  userMenuRef,
  setIsEditCustomerModalOpen,
  setIsDialogOpen,
  toggleMenu,
  isMenuOpen,
  showUserMenu,
  isHeader,
  token,
  shopifyAccessToken,
}) {
  return (
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
        onClick={() => navigate(ROUTES.ADD_TO_WISHLIST)}
      />
      <div className="relative">
        {cartItemsCount > 0 && (
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
        <ShoppingCart
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity shrink-0"
          style={{ color: theme.colors.text.primary }}
          onClick={() => {
            navigate(ROUTES.CART);
            window.scrollTo(0, 0);
          }}
        />
      </div>

      {(token && shopifyAccessToken)  ? (
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
                  Welcome,{" "}
                  <span className="font-bold">{user?.firstName}</span>
                </p>
              </div>
            </div>
            <Link
              to="/my-orders"
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
      ) : (
        <button
          className=" px-4 py-2 rounded-md"
          style={{
            backgroundColor: theme.colors.accent.primary,
            color: "white",
          }}
          onClick={() => {
            navigate(ROUTES.LOGIN);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Login
        </button>
      )}

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
  );
}

export default IconsSections;
