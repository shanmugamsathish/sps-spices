import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
import { ROUTES, LOGO } from "../lib/constant";
import { getCartDetails } from "../apiCalls/cart";
import {
  selectCart,
  selectCartItemsCount,
  setCart,
} from "../redux/productSlice";
import Desktop from "./Header/Desktop";
import IconsSections from "./Header/IconsSections";
import Mobile from "./Header/Mobile";
import { matchPath } from "react-router-dom";
import { getCollectionById } from "../apiCalls/collections";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const match = matchPath(
    { path: `${ROUTES.COLLECTION_PRODUCTS}/:id`, end: true },
    location.pathname
  );
  const isHeader = [ROUTES.TERMS_AND_CONDITION, ROUTES.PRIVACY_POLICY].includes(
    location.pathname
  );
  const isSearch =
    [ROUTES.HOME, ROUTES.PRODUCTS].includes(location.pathname) ||
    !!matchPath(
      { path: `${ROUTES.COLLECTION_PRODUCTS}/:id`, end: true },
      location.pathname
    );

  const isProductSearch = [ROUTES.HOME, ROUTES.PRODUCTS].includes(location.pathname)

  const isCollectionSearch = !!matchPath(
    { path: `${ROUTES.COLLECTION_PRODUCTS}/:id`, end: true },
    location.pathname
  );
  const id = match?.params?.id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user?.customer);
  const isActive = (path) => location.pathname === path;


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  // Get cart from Redux state (preferred method)
  const cart = useSelector(selectCart);
  const cartItemsCountFromRedux = useSelector(selectCartItemsCount);

  const token = sessionStorage.getItem("token");
  const shopifyAccessToken = sessionStorage.getItem("shopifyAccessToken");

  // Calculate cart count from Redux cart or fetch if needed
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    if (cart && cart.lines && cart.lines.edges) {
      const total = cart.lines.edges.reduce(
        (sum, edge) => sum + (edge.node.quantity || 0),
        0
      );
      setCartItemsCount(total);
      return;
    }
    // Otherwise, try to fetch from localStorage
    const storedCartId = localStorage.getItem("cartId");
    if (storedCartId) {
      const fetchCartItemsCount = async () => {
        try {
          const cartResponse = await getCartDetails(storedCartId);
          dispatch(setCart(cartResponse.cart));
          if (cartResponse?.success && cartResponse.cart?.lines?.edges) {
            const total = cartResponse.cart.lines.edges.reduce(
              (sum, edge) => sum + (edge.node.quantity || 0),
              0
            );
            setCartItemsCount(total);
          }
        } catch {
          // Cart doesn't exist or error fetching
          setCartItemsCount(0);
        }
      };
      fetchCartItemsCount();
    } else {
      setCartItemsCount(0);
    }
  }, [cart, cartItemsCountFromRedux, dispatch]);

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
  }, [dispatch]);

  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);
  const handleSearch = async (e) => {
    const query = e.target.value.trim();

    if (!query) {
      if (isProductSearch) {
        try {
          const allProducts = await getAllProducts();
          if (allProducts) {
            const productsArray = Array.isArray(allProducts) ? allProducts : [];
            dispatch(setProducts(productsArray));
          } else {
            dispatch(setProducts([]));
          }
        } catch (error) {
          console.error("Error fetching all products:", error);
          dispatch(setProducts([]));
        }
      }
      if (isCollectionSearch) {
        try {
          const response = await getCollectionById(id);
          const collectionData = response?.collection || response;
          dispatch(setProducts(collectionData.products));
        } catch (error) {
          console.error("Error fetching collection:", error);
          dispatch(setProducts([]));
        }
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
          className="flex items-center justify-start shrink-0 cursor-pointer"
          style={{
            width: "clamp(5rem, 8vw, 10rem)",
            minWidth: "5rem",
            maxWidth: "10rem",
          }}
          onClick={() => navigate(ROUTES.HOME)}
        >
          <img
            src={LOGO.LOGO}
            alt="logo"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
          />
        </div>

        {/* Desktop Navigation - Fixed Width (Responsive) */}

        <Desktop
          isActive={isActive}
          isHeader={isHeader}
          token={token}
          shopifyAccessToken={shopifyAccessToken}
        />
        {/* Icons Section - Fixed Width (Responsive) with Permanent Search Input */}
        {(!isHeader || (isHeader && token && shopifyAccessToken)) && (
          <IconsSections
            isSearchOpen={isSearchOpen}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            setIsSearchOpen={setIsSearchOpen}
            searchQuery={searchQuery}
            dispatch={dispatch}
            setProducts={setProducts}
            getAllProducts={getAllProducts}
            navigate={navigate}
            ROUTES={ROUTES}
            cartItemsCount={cartItemsCount}
            user={user?.firstName}
            setShowUserMenu={setShowUserMenu}
            userMenuRef={userMenuRef}
            setIsEditCustomerModalOpen={setIsEditCustomerModalOpen}
            setIsDialogOpen={setIsDialogOpen}
            toggleMenu={toggleMenu}
            isMenuOpen={isMenuOpen}
            showUserMenu={showUserMenu}
            token={token}
            shopifyAccessToken={shopifyAccessToken}
            isSearch={isSearch}
          />
        )}
        {/* Show Login button when isHeader and token and shopifyAccessToken are not present */}
        {isHeader && !token && !shopifyAccessToken && (
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
      </div>

      {/* Mobile Navigation Menu */}
      <Mobile
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isActive={isActive}
      />

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
