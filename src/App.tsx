import { useSelector } from "react-redux";
import Navbar from "./components/navbar";
import Index from "./pages";
import User from "./pages/dashboard/user";
import { RootState } from "./stores/reducers/reducer";

const App = () => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  return (
    <>
      <Navbar />
      {userInfo.role === "user" ? <User /> : <Index />}
    </>
  );
};

export default App;
