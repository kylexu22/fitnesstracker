import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Plus, BarChart3 } from "lucide-react";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="w-6 h-6" />
          </button>

          {/* Start Workout - Center with elevated design */}
          <button
            onClick={() => navigate("/start-workout")}
            className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-7 h-7" />
          </button>

          {/* Analytics */}
          <button
            onClick={() => navigate("/analytics")}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
              isActive("/analytics") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BarChart3 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
