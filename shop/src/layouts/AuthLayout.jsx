import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { authSelect } from "../redux/features/authSlice";

const AuthLayout = () => {
  const { userInfo, isLoggedIn } = useSelector(authSelect);

  return (
    <div className="w-full fixed">
      <Header hasSearch={false} isLoggedIn={isLoggedIn} userInfo={userInfo} />
      <div className="m-auto h-screen flex items-center justify-center bg-slate-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
