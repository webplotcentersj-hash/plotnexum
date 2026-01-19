import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Network,
  Briefcase,
  Plus,
  Search,
  Bell,
  Settings,
  Share2,
  Save
} from 'lucide-react';
import Button from './components/ui/Button';
import Dashboard from './components/dashboard/Dashboard';
import KanbanBoard from './components/kanban/KanbanBoard';
import MindMap from './components/mindmap/MindMap';

// --- Componente Principal App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 overflow-hidden`}>

      {/* Sidebar de Navegación */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 transition-all duration-300">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-[#eb671b] flex items-center justify-center shadow-lg shadow-[#eb671b]/30`}>
              <span className="font-bold text-xl">P</span>
            </div>
            <span className="ml-3 font-bold text-lg tracking-tight hidden lg:block">Plot Nexus</span>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'projects', label: 'Proyectos', icon: Briefcase },
              { id: 'mindmap', label: 'Mapa Mental', icon: Network },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                  ? `bg-[#eb671b] shadow-lg shadow-[#eb671b]/50 text-white`
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <item.icon size={22} className={activeTab === item.id ? 'animate-pulse' : ''} />
                <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center lg:justify-start p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings size={22} />
            <span className="ml-3 font-medium hidden lg:block">Configuración</span>
          </button>

          <div className="mt-4 hidden lg:flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-400"></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Usuario Pro</p>
              <p className="text-xs text-slate-400 truncate">admin@plotnexus.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header Superior */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            {activeTab === 'dashboard' && 'Panel de Control'}
            {activeTab === 'projects' && 'Gestión de Proyectos'}
            {activeTab === 'mindmap' && 'Ideación y Mapas'}
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar proyecto..."
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#eb671b] w-64 text-sm transition-all"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <Button variant="primary" icon={Plus} className="hidden sm:flex">
              Nuevo
            </Button>
          </div>
        </header>

        {/* Contenido Dinámico */}
        <div className="flex-1 overflow-hidden p-6 relative">

          {activeTab === 'dashboard' && (
            <Dashboard setActiveTab={setActiveTab} />
          )}

          {activeTab === 'projects' && (
            <div className="h-full animate-in fade-in zoom-in-95 duration-300">
              <KanbanBoard />
            </div>
          )}

          {activeTab === 'mindmap' && (
            <div className="h-full animate-in fade-in zoom-in-95 duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Lienzo de Ideas</h2>
                  <span className="bg-orange-100 text-[#eb671b] text-xs px-2 py-1 rounded-full font-bold self-center">Beta</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" icon={Share2}>Compartir</Button>
                  <Button variant="primary" icon={Save}>Guardar</Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <MindMap />
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
