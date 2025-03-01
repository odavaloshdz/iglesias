import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { cn } from "@/lib/utils";

interface DashboardProps {
  userName?: string;
  userRole?: string;
  defaultView?:
    | "list"
    | "form"
    | "detail"
    | "search"
    | "digitalize"
    | "ai-settings"
    | "mass-intentions";
  defaultDocumentType?: "baptism" | "marriage" | "communion" | "confirmation";
  onLogout?: () => void;
}

const Dashboard = ({
  userName = "Admin Usuario",
  userRole = "Administrador",
  defaultView = "list",
  defaultDocumentType = "baptism",
  onLogout = () => {},
}: DashboardProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar
        userName={userName}
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onLogout={onLogout}
      />
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarCollapsed ? "ml-16 lg:ml-16" : "ml-0 lg:ml-64",
        )}
      >
        <MainContent
          defaultView={defaultView}
          defaultDocumentType={defaultDocumentType}
        />
      </div>
    </div>
  );
};

export default Dashboard;
