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

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserProvider>
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
                  <Route path="/room/:id" element={<Room />} />
                </Routes>
              </div>
            </div>
          </UserProvider>
        </SignedIn>
      </header>
    </BrowserRouter>
  );
}
