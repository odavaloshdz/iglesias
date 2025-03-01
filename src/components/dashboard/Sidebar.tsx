import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Home,
  BookOpen,
  Heart,
  Droplet,
  UserCheck,
  Menu,
  X,
  Search,
  Scan,
  Cpu,
  Calendar,
  Church,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  userName?: string;
  userRole?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
}

const Sidebar = ({
  userName = "Admin Usuario",
  userRole = "Administrador",
  isCollapsed = false,
  onToggleCollapse = () => {},
  onLogout = () => {},
}: SidebarProps) => {
  const [openSection, setOpenSection] = useState<string | null>("documents");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const sidebarContent = (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Iglesia App</span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        )}
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="mx-auto"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <NavItem
            to="/"
            icon={<Home className="h-5 w-5" />}
            label="Inicio"
            isCollapsed={isCollapsed}
          />

          <CollapsibleNavSection
            icon={<FileText className="h-5 w-5" />}
            label="Documentos"
            isOpen={openSection === "documents"}
            onToggle={() => toggleSection("documents")}
            isCollapsed={isCollapsed}
          >
            <NavItem
              to="/documents/baptism"
              icon={<Droplet className="h-4 w-4" />}
              label="Bautismo"
              isCollapsed={isCollapsed}
              isSubItem
            />
            <NavItem
              to="/documents/marriage"
              icon={<Heart className="h-4 w-4" />}
              label="Matrimonio"
              isCollapsed={isCollapsed}
              isSubItem
            />
            <NavItem
              to="/documents/communion"
              icon={<BookOpen className="h-4 w-4" />}
              label="Primera Comunión"
              isCollapsed={isCollapsed}
              isSubItem
            />
            <NavItem
              to="/documents/confirmation"
              icon={<UserCheck className="h-4 w-4" />}
              label="Confirmación"
              isCollapsed={isCollapsed}
              isSubItem
            />
          </CollapsibleNavSection>

          <NavItem
            to="/search"
            icon={<Search className="h-5 w-5" />}
            label="Búsqueda Avanzada"
            isCollapsed={isCollapsed}
          />

          <NavItem
            to="/digitalize"
            icon={<Scan className="h-5 w-5" />}
            label="Digitalizar Documentos"
            isCollapsed={isCollapsed}
          />

          <NavItem
            to="/mass-intentions"
            icon={<Church className="h-5 w-5" />}
            label="Intenciones de Misa"
            isCollapsed={isCollapsed}
          />

          <CollapsibleNavSection
            icon={<Users className="h-5 w-5" />}
            label="Administración"
            isOpen={openSection === "admin"}
            onToggle={() => toggleSection("admin")}
            isCollapsed={isCollapsed}
          >
            <NavItem
              to="/admin/users"
              icon={<Users className="h-4 w-4" />}
              label="Usuarios"
              isCollapsed={isCollapsed}
              isSubItem
            />
            <NavItem
              to="/admin/settings"
              icon={<Settings className="h-4 w-4" />}
              label="Configuración"
              isCollapsed={isCollapsed}
              isSubItem
            />
            <NavItem
              to="/admin/ai-settings"
              icon={<Cpu className="h-4 w-4" />}
              label="Configuración IA"
              isCollapsed={isCollapsed}
              isSubItem
            />
          </CollapsibleNavSection>
        </nav>
      </div>

      {/* User Profile */}
      <div className="border-t p-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cerrar sesión</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mb-2">
                    {userName.charAt(0)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{userName}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cerrar sesión</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative w-64 h-full">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={toggleMobileMenu}
          />
          {/* Sidebar content */}
          <div className="relative h-full">{sidebarContent}</div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full">{sidebarContent}</div>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isSubItem?: boolean;
}

const NavItem = ({
  to,
  icon,
  label,
  isCollapsed,
  isSubItem = false,
}: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors",
        isSubItem && !isCollapsed && "pl-10",
        isSubItem && isCollapsed && "justify-center",
      )}
    >
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-gray-600">{icon}</span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>
          <span className="text-gray-600">{icon}</span>
          <span className="ml-3">{label}</span>
        </>
      )}
    </Link>
  );
};

interface CollapsibleNavSectionProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  children: React.ReactNode;
}

const CollapsibleNavSection = ({
  icon,
  label,
  isOpen,
  onToggle,
  isCollapsed,
  children,
}: CollapsibleNavSectionProps) => {
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="w-full flex justify-center items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-600">{icon}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col items-start">
            <p className="font-medium">{label}</p>
            <div className="mt-1 space-y-1">{children}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
          <div className="flex items-center">
            <span className="text-gray-600">{icon}</span>
            <span className="ml-3">{label}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Sidebar;
