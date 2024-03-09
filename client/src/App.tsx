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

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <SignedOut>
          <SignInButton />
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
                    <Route path="/room/:roomId" element={<Room />} />
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
