import { HashRouter  } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  return (
    <>
      <AuthProvider>
        <HashRouter >
          <AppRoutes />
        </HashRouter >
      </AuthProvider>

      <Toaster position="top-right" />
    </>
  );
}

export default App;