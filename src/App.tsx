import { useState } from "react";
import Navbar from "./components/navbar";
import Index from "./pages";
import User from "./pages/dashboard/user";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  return (
    <>
      <Navbar />
      {isLoggedIn ? <User /> : <Index />}
    </>
  );
};

export default App;
