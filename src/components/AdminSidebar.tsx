import { Newspaper, Users, BookOpen, Layout, LogOut, Home, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: Layout },
  { title: "News", url: "/admin/news", icon: Newspaper },
  { title: "Faculty", url: "/admin/faculty", icon: Users },
  { title: "Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Page Content", url: "/admin/pages", icon: Layout },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Shield className="w-4 h-4 mr-2" />
            {!collapsed && "Admin Panel"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/admin"} className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2">
        <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Home className="w-4 h-4" />
          {!collapsed && "View Website"}
        </a>
        {user && (
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            )}
            <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              {!collapsed && "Sign Out"}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
