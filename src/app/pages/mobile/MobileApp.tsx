import { Outlet } from "react-router";

export default function MobileApp() {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <Outlet />
    </div>
  );
}
