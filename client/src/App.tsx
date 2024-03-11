import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import Home from "./pages/Home";
import Navbar from "./layout/Navbar";
import { UserProvider } from "./context/userContext";
import "./App.css";
import Sidebar from "./layout/Sidebar";
import Room from "./pages/Room";
import NotFound from "./components/NotFound";
import { DataProvider } from "./context/dataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorised from "./components/Unauthorised";
import logo from "../src/assets/logo-icon.gif";

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <SignedOut>
          <div className="sign-in-page">
            <img src={logo} />
            <div>
              <h1>Welcome to the Media Beast Community</h1>
              <SignInButton />
            </div>
          </div>
        </SignedOut>
        <SignedIn>
          <UserProvider>
            <DataProvider>
              <Navbar>
                <UserButton />
              </Navbar>
              <div className="container">
                <div className="sidebar">
                  <Sidebar />
                </div>
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/room/:roomId"
                      element={
                        <ProtectedRoute>
                          <Room />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/unauthorised" element={<Unauthorised />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </DataProvider>
          </UserProvider>
        </SignedIn>
      </header>
    </BrowserRouter>
  );
}
