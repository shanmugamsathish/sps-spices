import Header from "./Components/Header";
import Footer from "./Components/Footer";

import theme from "./lib/theme";
import store from "./redux/reducer";
import { Provider, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AdminSidebarProvider } from "./contexts/AdminSidebarContext";
import Admin from "./Routes/Admin";
import User from "./Routes/User";
import { Toaster } from "react-hot-toast";
import Loader from "./Components/Loader";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    <>
    <div
      className="flex flex-col min-h-screen poppins-medium"
      style={{
        backgroundColor: theme.colors.background.main,
        color: theme.colors.text.primary,
      }}
    >
      {isLoading && <Loader />}
      {isAdmin ? (
        <AdminSidebarProvider>
          <Admin />
        </AdminSidebarProvider>
      ) : (
        <>
          <Header />
          <User />
          <Footer />
        </>
      )}
      <Toaster />
    </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
