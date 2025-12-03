import React, { useState } from 'react';
import { Menu, X, LogOut, User as UserIcon, ChevronDown, Infinity as InfinityIcon, Sun, Moon } from 'lucide-react';
import { NAV_ITEMS } from '../../constants';
import { User } from '../../types';
import { logout } from '../../services/authService';
import { PremiumLogo } from './premium/Logo';
import { useTheme } from './ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative transition-colors duration-300">

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <PremiumLogo className="scale-75 origin-left text-slate-900 dark:text-white" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full transition-all duration-300">
          <div className="p-6 flex items-center justify-between gap-3">
            <PremiumLogo />
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto space-y-4">
            {/* Theme Toggle Desktop */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm font-medium">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>

            {/* Credit Card */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Créditos Restantes</p>

              {user.maxCredits === -1 ? (
                <div className="flex items-center gap-2">
                  <InfinityIcon className="w-6 h-6 text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-bold">ILIMITADO</span>
                </div>
              ) : (
                <>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-500 ${user.isDemo ? (user.creditsUsed >= user.maxCredits ? 'bg-red-500' : 'bg-emerald-500') : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(((user.creditsUsed / user.maxCredits) * 100), 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{user.creditsUsed} / {user.maxCredits}</span>
                    <span className="text-slate-400">{Math.max(0, user.maxCredits - user.creditsUsed)} Disp.</span>
                  </div>
                </>
              )}
            </div>

            {/* User Profile */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <div
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">{user.isDemo ? 'Utilizador Demo' : user.plan}</p>
                </div>
                {!user.isDemo && <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />}
              </div>

              {isUserMenuOpen && !user.isDemo && (
                <div className="mt-2 space-y-1 animate-fade-in-up">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Terminar Sessão
                  </button>
                  <button
                    onClick={() => onTabChange('client-area')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" /> Área de Cliente
                  </button>
                </div>
              )}

              {/* Demo Exit Button */}
              {user.isDemo && (
                <div className="mt-2 animate-fade-in-up">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sair da Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white dark:bg-slate-900 w-72 h-full p-4 border-r border-slate-200 dark:border-slate-800 animate-slide-right shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-8 px-2">
                <PremiumLogo />
              </div>
              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-8 left-4 right-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
                <button
                  onClick={() => {
                    onTabChange('client-area');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <UserIcon className="w-4 h-4" /> Área de Cliente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 relative scroll-smooth bg-slate-50 dark:bg-slate-900 w-full transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};