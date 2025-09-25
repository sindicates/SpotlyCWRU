import { Outlet } from "react-router-dom";
import { SessionProvider } from "./hooks/useAuth";

const Providers = () => {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
};

export default Providers;
