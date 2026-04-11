import { HashRouter  } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  return (
    <>
      <HashRouter >
        <AuthProvider>
          <AppRoutes />
         <Toaster
            position="top-center"
            containerStyle={{
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </AuthProvider>
      </HashRouter >

      
    </>
  );
}

export default App;