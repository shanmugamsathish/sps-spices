import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, LogOut, Users, Folder, ListOrdered, Image, Package } from "lucide-react";
import { useLocation } from "react-router-dom";
import theme from "../lib/theme";
import { ROUTES, LOGO } from "../lib/constant";
import { UseAdminSidebar } from "../contexts/AdminSidebarContext";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DialogBox from "./DialogBox";

function AdminHeader() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false);
  const { isCollapsed, toggleCollapse } = UseAdminSidebar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const desktopLogoDropdownRef = useRef(null);
  const mobileLogoDropdownRef = useRef(null);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDesktopClick = desktopLogoDropdownRef.current && desktopLogoDropdownRef.current.contains(event.target);
      const isMobileClick = mobileLogoDropdownRef.current && mobileLogoDropdownRef.current.contains(event.target);
      
      if (!isDesktopClick && !isMobileClick) {
        setIsLogoDropdownOpen(false);
      }
    };

    if (isLogoDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLogoDropdownOpen]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsLogoDropdownOpen(!isLogoDropdownOpen);
  };

  const handleChangeBannerImage = () => {
    setIsLogoDropdownOpen(false);
    navigate(ROUTES.ADMIN_EDIT_BANNER_IMAGES);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("shopifyAccessToken");
      navigate("/admin/login");
      dispatch(setUser(null));
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
  }
    finally {
      setIsMobileMenuOpen(false);
    }
  }

  const menuItems = [
    {
      path: ROUTES.ADMIN_CUSTOMERS,
      label: "Customers",
      icon: Users,
    },
    {
      path: ROUTES.ADMIN_ORDERS,
      label: "Orders",
      icon: ListOrdered,
    },
    {
      path: ROUTES.ADMIN_PRODUCTS,
      label: "Products",
      icon: ShoppingBag,
    },
    {
      path: ROUTES.ADMIN_COLLECTIONS,
      label: "Collections",
      icon: Folder,
    },
    {
      path: ROUTES.ADMIN_AMAZON_PRODUCTS,
      label: "Amazon Products",
      icon: ShoppingBag,
    },
    {
      path: ROUTES.ADMIN_FLIPKART_PRODUCTS,
      label: "Flipkart Products",
      icon: ShoppingBag,
    },
    {
      path: ROUTES.ADMIN_LOGOUT,
      label: "Logout",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen z-50 flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-60"
        }`}
        style={{
          backgroundColor: theme.colors.background.main,
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.colors.border.light }}>
          {!isCollapsed && (
            <div className="relative" ref={desktopLogoDropdownRef}>
              <button
                onClick={handleLogoClick}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Logo menu"
              >
                <img
                  src={LOGO.LOGO}
                  alt="logo"
                  className="h-12 w-auto object-contain"
                />
              </button>
              
              {/* Dropdown Menu */}
              {isLogoDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-50"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${theme.colors.border.light}`,
                  }}
                >
                  <button
                    onClick={handleChangeBannerImage}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg border-b border-gray-200"
                    style={{ color: theme.colors.text.primary }}
                  >
                    <Image className="w-5 h-5" />
                    <span className="font-medium text-sm">Change Banner Pic</span>
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.ADMIN_PRODUCT_LIST)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
                    style={{ color: theme.colors.text.primary }}
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-medium text-sm">Product List</span>
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="ml-auto p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" style={{ color: theme.colors.text.primary }} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              // If item provides an onClick handler (like Logout), render a button so navigation is controlled.
              if (typeof item.onClick === "function") {
                return (
                  <button
                    key={item.path}
                    type="button"
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
                      active ? "shadow-md" : "hover:shadow-sm"
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor: theme.colors.accent.primary,
                            color: "#FFFFFF",
                          }
                        : {
                            backgroundColor: "transparent",
                            color: theme.colors.text.primary,
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = theme.colors.background.main;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active ? "shadow-md" : "hover:shadow-sm"
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: theme.colors.accent.primary,
                          color: "#FFFFFF",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: theme.colors.text.primary,
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = theme.colors.background.main;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header
        className="lg:hidden w-full shadow-sm sticky top-0 z-50"
        style={{
          backgroundColor: "#FFFFFF",
          color: theme.colors.text.primary,
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="relative" ref={mobileLogoDropdownRef}>
            <button
              onClick={handleLogoClick}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Logo menu"
            >
              <img
                src={LOGO.LOGO}
                alt="logo"
                className="h-10 w-auto object-contain"
              />
            </button>
            
            {/* Dropdown Menu */}
            {isLogoDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-50"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <button
                  onClick={handleChangeBannerImage}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
                  style={{ color: theme.colors.text.primary }}
                >
                  <Image className="w-5 h-5" />
                  <span className="font-medium text-sm">Change Banner Image</span>
                </button>
                <button
                  onClick={() => navigate(ROUTES.ADMIN_PRODUCT_LIST)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
                  style={{ color: theme.colors.text.primary }}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium text-sm">Product List</span>
                </button>
              </div>
            )}
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <nav
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="px-4 pb-4 space-y-2 border-t"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: theme.colors.border.light,
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              if (typeof item.onClick === "function") {
                return (
                  <button
                    key={item.path}
                    type="button"
                    className={`flex items-center gap-3 py-3 px-4 w-full rounded-lg transition-all duration-200 ${
                      active ? "shadow-md" : ""
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor: theme.colors.accent.primary,
                            color: "#FFFFFF",
                          }
                        : {
                            backgroundColor: "transparent",
                            color: theme.colors.text.primary,
                          }
                    }
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDialogOpen(true);
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = theme.colors.background.main;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                    active ? "shadow-md" : ""
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: theme.colors.accent.primary,
                          color: "#FFFFFF",
                        }
                      : {
                          backgroundColor: "transparent",
                          color: theme.colors.text.primary,
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = theme.colors.background.main;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <DialogBox isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Logout" description="Are you sure you want to logout?" onConfirm={handleLogout} />
    </>
  );
}

export default AdminHeader;
