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

export default function App() {
  return (
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
              <Home />
            </div>
          </div>
        </UserProvider>
      </SignedIn>
    </header>
  );
}
