import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Trophy, User, ChevronRight, Menu, X, Code2, LogIn, LogOut, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const navItems = [
  { to: '/', label: '首页', icon: Home, accent: 'amber', activeBg: 'bg-amber-500/20', activeText: 'text-amber-400', activeBorder: 'from-amber-400 to-yellow-500', iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-500', dotColor: 'bg-amber-400' },
  { to: '/courses', label: '课程中心', icon: BookOpen, accent: 'emerald', activeBg: 'bg-emerald-500/20', activeText: 'text-emerald-400', activeBorder: 'from-emerald-400 to-green-500', iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500', dotColor: 'bg-emerald-400' },
  { to: '/bootcamp', label: '实战训练营', icon: Code2, accent: 'violet', activeBg: 'bg-violet-500/20', activeText: 'text-violet-400', activeBorder: 'from-violet-400 to-purple-500', iconBg: 'bg-gradient-to-br from-violet-400 to-purple-500', dotColor: 'bg-violet-400' },
  { to: '/ai-chat', label: 'AI 助手', icon: MessageSquare, accent: 'indigo', activeBg: 'bg-indigo-500/20', activeText: 'text-indigo-400', activeBorder: 'from-indigo-400 to-blue-500', iconBg: 'bg-gradient-to-br from-indigo-400 to-blue-500', dotColor: 'bg-indigo-400' },
  { to: '/achievements', label: '成就中心', icon: Trophy, accent: 'rose', activeBg: 'bg-rose-500/20', activeText: 'text-rose-400', activeBorder: 'from-rose-400 to-pink-500', iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500', dotColor: 'bg-rose-400' },
  { to: '/profile', label: '个人中心', icon: User, accent: 'cyan', activeBg: 'bg-cyan-500/20', activeText: 'text-cyan-400', activeBorder: 'from-cyan-400 to-teal-500', iconBg: 'bg-gradient-to-br from-cyan-400 to-teal-500', dotColor: 'bg-cyan-400' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        setMobileOpen(false);
      } else if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const breadcrumbs = (() => {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);
    const crumbs: { label: string; to: string }[] = [{ label: '首页', to: '/' }];

    if (parts.length === 0) return crumbs;

    if (parts[0] === 'courses') {
      crumbs.push({ label: '课程中心', to: '/courses' });
      if (parts[1]) {
        crumbs.push({ label: '课程详情', to: `/courses/${parts[1]}` });
      }
      if (parts[2]) {
        crumbs.push({ label: '知识点学习', to: `/courses/${parts[1]}/${parts[2]}` });
      }
    } else if (parts[0] === 'practice') {
      crumbs.push({ label: '编程练习', to: `/practice/${parts[1] || ''}` });
    } else if (parts[0] === 'quiz') {
      crumbs.push({ label: '章节测评', to: `/quiz/${parts[1] || ''}` });
    } else if (parts[0] === 'bootcamp') {
      crumbs.push({ label: '实战训练营', to: '/bootcamp' });
      if (parts[1]) {
        crumbs.push({ label: '项目详情', to: `/bootcamp/${parts[1]}` });
      }
    } else if (parts[0] === 'learning-plan') {
      crumbs.push({ label: '学习规划', to: '/' });
      if (parts[1]) {
        crumbs.push({ label: '课程大纲', to: `/learning-plan/${parts[1]}` });
      }
    } else if (parts[0] === 'achievements') {
      crumbs.push({ label: '成就中心', to: '/achievements' });
    } else if (parts[0] === 'ai-chat') {
      crumbs.push({ label: 'AI 助手', to: '/ai-chat' });
    } else if (parts[0] === 'profile') {
      crumbs.push({ label: '个人中心', to: '/profile' });
    } else if (parts[0] === 'auth') {
      crumbs.push({ label: '账号', to: '/auth' });
    }

    return crumbs;
  })();

  const sidebarWidth = collapsed ? 'w-16' : 'w-60';

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full ${sidebarWidth} bg-[#e7f9f6] text-gray-800 flex flex-col transition-all duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-emerald-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-emerald-500/30">
            D
          </div>
          {!collapsed && (
            <span className="ml-3 text-lg font-bold whitespace-nowrap text-emerald-700">数据分析</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon, activeBg, activeText, activeBorder, iconBg, dotColor }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive
                  ? `${activeBg} ${activeText} border-l-[3px] border-transparent`
                  : 'text-gray-600 hover:bg-emerald-100 hover:text-gray-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b ${activeBorder}`} />
                  )}
                  <span className={`shrink-0 flex items-center justify-center w-5 h-5 ${isActive ? iconBg + ' rounded-md p-0.5' : ''}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                  </span>
                  {!collapsed && <span className="whitespace-nowrap">{label}</span>}
                  {!isActive && !collapsed && (
                    <span className={`ml-auto w-1.5 h-1.5 rounded-full ${dotColor} opacity-40 group-hover:opacity-80 transition-opacity duration-200`} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center h-12 border-t border-emerald-200 text-gray-400 hover:text-gray-600 hover:bg-emerald-100 transition-all duration-200"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>

        {/* Auth button */}
        <div className="border-t border-emerald-200 p-2">
          {isLoggedIn && currentUser ? (
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm whitespace-nowrap">退出登录</span>}
            </button>
          ) : (
            <NavLink
              to="/auth"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-emerald-100 hover:text-gray-800 transition-all duration-200"
            >
              <LogIn className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm whitespace-nowrap">登录 / 注册</span>}
            </NavLink>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center px-3 sm:px-4 md:px-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-40" />
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden mr-2 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>

          {/* Breadcrumb - truncated on small screens */}
          <nav className="flex items-center text-sm text-gray-500 min-w-0 overflow-hidden">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.to} className="flex items-center min-w-0 shrink-0 last:shrink last:min-w-0">
                {idx > 0 && <ChevronRight className="w-4 h-4 mx-1 text-gray-400 shrink-0" />}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-indigo-600 font-medium truncate">{crumb.label}</span>
                ) : idx === 0 ? (
                  <NavLink to={crumb.to} className="hover:text-indigo-600 transition-all duration-200 shrink-0">
                    {crumb.label}
                  </NavLink>
                ) : (
                  <NavLink to={crumb.to} className="hover:text-indigo-600 transition-all duration-200 hidden sm:block truncate">
                    {crumb.label}
                  </NavLink>
                )}
                {/* Show ellipsis for hidden middle items on small screens */}
                {idx > 0 && idx < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 mx-1 text-gray-400 shrink-0 sm:hidden" />
                )}
              </span>
            ))}
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
