import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const AuthLayout = () => {
  return (
    <div className="w-full fixed">
      <Header hasSearch={false} />
      <div className="m-auto h-screen flex items-center justify-center bg-slate-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
