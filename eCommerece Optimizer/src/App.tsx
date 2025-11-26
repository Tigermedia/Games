import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Stores } from "./pages/Stores";
import { Products } from "./pages/Products";
import { Optimize } from "./pages/Optimize";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Routes>
            <Route
              path="/sign-in/*"
              element={
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  afterSignInUrl="/"
                />
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  afterSignUpUrl="/"
                />
              }
            />
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </div>
      </SignedOut>

      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/products" element={<Products />} />
            <Route path="/optimize" element={<Optimize />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </SignedIn>
    </>
  );
}

export default App;
