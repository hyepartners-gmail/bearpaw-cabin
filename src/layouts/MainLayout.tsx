import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;