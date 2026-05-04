"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  DollarSign,
  MessageSquare,
  BookOpen,
  Users,
  Mail,
  Newspaper,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Tractor,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/store/authStore";

const NAV_GROUPS = [
  {
    title: "OVERVIEW",
    links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "CONTENT",
    links: [
      { href: "/admin/services", label: "Services", icon: Briefcase },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/blogs", label: "Blog Posts", icon: FileText },
      { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
      {
        href: "/admin/testimonials",
        label: "Testimonials",
        icon: MessageSquare,
      },
      { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
      { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
      { href: "/admin/applications", label: "Job Applications", icon: Users },
    ],
  },
  {
    title: "USERS & LEADS",
    links: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/leads", label: "Leads", icon: Mail },
      { href: "/admin/newsletter", label: "Newsletter", icon: Newspaper },
    ],
  },
  {
    title: "AI",
    links: [{ href: "/admin/ai-tools", label: "AI Tools Stats", icon: Brain }],
  },
  {
    title: "SETTINGS",
    links: [{ href: "/admin/config", label: "Site Config", icon: Settings }],
  },
];

export function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="fixed left-0 top-0 h-screen bg-[#0a0a0f] border-r border-white/5 z-50 flex flex-col"
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-bold shrink-0">
            T
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display font-black text-white text-lg tracking-tight"
            >
              TFX <span className="text-brand-pink">ADMIN</span>
            </motion.span>
          )}
        </Link>
      </div>

      {/* Nav Section */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-2">
            {!collapsed && (
              <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] px-2 mb-4">
                {group.title}
              </p>
            )}
            {group.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all relative group",
                    isActive
                      ? "bg-brand-pink/10 text-brand-pink"
                      : "text-gray-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <link.icon
                    className={cn(
                      "w-5 h-5 shrink-0",
                      isActive ? "text-brand-pink" : "text-gray-400",
                    )}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{link.label}</span>
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="admin-nav-active"
                      className="absolute left-0 top-1 bottom-1 w-1 bg-brand-pink rounded-full"
                    />
                  )}

                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-white text-dark-bg text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100]">
                      {link.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group relative"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-bold">Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
