import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function Root() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      <Outlet />
    </div>
  );
}