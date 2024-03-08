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

export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserProvider>
          <div className="container">
            <Navbar>
              <UserButton />
            </Navbar>
            <Home />
          </div>
        </UserProvider>
      </SignedIn>
    </header>
  );
}
