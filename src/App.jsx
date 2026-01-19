import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Network,
  Briefcase,
  Plus,
  MoreHorizontal,
  Search,
  Bell,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Trash2,
  ZoomIn,
  ZoomOut,
  Save,
  Share2
} from 'lucide-react';

// --- Constantes de Diseño ---
const BRAND_COLOR = "bg-[#eb671b]";
const BRAND_COLOR_HOVER = "hover:bg-[#d35a15]"; // Un poco más oscuro
const BRAND_TEXT = "text-[#eb671b]";
const BRAND_BORDER = "border-[#eb671b]";
const BRAND_SHADOW = "shadow-[#eb671b]/30";

// --- Componentes UI Reutilizables ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", onClick, icon: Icon }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 active:scale-95";
  const variants = {
    primary: `${BRAND_COLOR} ${BRAND_COLOR_HOVER} text-white shadow-lg ${BRAND_SHADOW}`,
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
    ghost: `text-slate-500 hover:text-[#eb671b] hover:bg-orange-50 dark:hover:bg-orange-900/20`,
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- Módulo de Gestión de Proyectos (Kanban) ---

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Análisis de Mercado Q1", tag: "Estrategia", status: "todo", members: 3 },
    { id: 2, title: "Diseño de Prototipo App", tag: "Diseño", status: "inprogress", members: 2 },
    { id: 3, title: "Reunión con Inversores", tag: "Finanzas", status: "done", members: 5 },
    { id: 4, title: "Campaña de Marketing", tag: "Marketing", status: "todo", members: 1 },
  ]);

  const columns = [
    { id: "todo", title: "Por Hacer", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500" },
    { id: "inprogress", title: "En Progreso", icon: Clock, color: "text-blue-500", bg: "bg-blue-500" },
    { id: "done", title: "Completado", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500" }
  ];

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 min-w-[1000px] pb-4">
        {columns.map(col => (
          <div key={col.id} className="flex-1 min-w-[300px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.bg}`} />
                <h3 className="font-bold text-slate-700 dark:text-slate-200">{col.title}</h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <Button variant="ghost" className="!p-1"><Plus size={16} /></Button>
            </div>

            <div className="flex flex-col gap-3">
              {tasks.filter(t => t.status === col.id).map(task => (
                <Card key={task.id} className="p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${task.tag === 'Estrategia' ? 'bg-purple-100 text-purple-600' :
                      task.tag === 'Diseño' ? 'bg-pink-100 text-pink-600' :
                        task.tag === 'Finanzas' ? 'bg-green-100 text-green-600' :
                          'bg-slate-100 text-slate-600'
                      }`}>
                      {task.tag}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">{task.title}</h4>

                  <div className="flex items-center justify-between mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                    <div className="flex -space-x-2">
                      {[...Array(task.members)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-[#eb671b] border-2 border-white dark:border-slate-800" />
                      ))}
                    </div>

                    {/* Controles simples de movimiento para la demo */}
                    <div className="flex gap-1">
                      {col.id !== 'todo' && (
                        <button onClick={() => moveTask(task.id, col.id === 'done' ? 'inprogress' : 'todo')} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                          ←
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button onClick={() => moveTask(task.id, col.id === 'todo' ? 'inprogress' : 'done')} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                          →
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              <button className={`w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:border-[#eb671b] hover:text-[#eb671b] transition-colors flex items-center justify-center gap-2 font-medium text-sm`}>
                <Plus size={16} /> Agregar Tarea
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Módulo de Mapa Mental Interactivo ---

const MindMap = () => {
  const [nodes, setNodes] = useState([
    { id: 1, x: 400, y: 300, label: "Idea Central", type: "root" },
    { id: 2, x: 250, y: 150, label: "Marketing", type: "child" },
    { id: 3, x: 550, y: 150, label: "Producto", type: "child" },
    { id: 4, x: 250, y: 450, label: "Ventas", type: "child" },
    { id: 5, x: 550, y: 450, label: "Finanzas", type: "child" },
  ]);

  const [connections, setConnections] = useState([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 1, to: 5 },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef(null);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null);
    }
  };

  const addNode = () => {
    const parent = selectedNode ? nodes.find(n => n.id === selectedNode) : nodes[0];
    const newId = Date.now();
    const offsetX = (Math.random() - 0.5) * 200;
    const offsetY = (Math.random() - 0.5) * 200;

    const newNode = {
      id: newId,
      x: parent.x + offsetX,
      y: parent.y + offsetY + 100,
      label: "Nueva Idea",
      type: "child"
    };

    setNodes([...nodes, newNode]);
    if (parent) {
      setConnections([...connections, { from: parent.id, to: newId }]);
    }
    setSelectedNode(newId);
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    if (nodes.find(n => n.id === selectedNode).type === 'root') return;

    setNodes(nodes.filter(n => n.id !== selectedNode));
    setConnections(connections.filter(c => c.from !== selectedNode && c.to !== selectedNode));
    setSelectedNode(null);
  };

  const moveNode = (id, dx, dy) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, x: n.x + dx, y: n.y + dy } : n));
  };

  return (
    <div className="relative w-full h-full bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner group">
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#eb671b 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      {/* Toolbar del Mapa */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex gap-1">
          <button onClick={addNode} className={`p-2 hover:bg-orange-50 text-[#eb671b] rounded-md`} title="Agregar Nodo">
            <Plus size={20} />
          </button>
          <button onClick={deleteNode} disabled={!selectedNode} className="p-2 hover:bg-red-50 text-red-500 rounded-md disabled:opacity-30 disabled:cursor-not-allowed" title="Eliminar">
            <Trash2 size={20} />
          </button>
          <div className="w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 hover:bg-slate-100 text-slate-600 rounded-md">
            <ZoomIn size={20} />
          </button>
          <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-slate-100 text-slate-600 rounded-md">
            <ZoomOut size={20} />
          </button>
        </div>
      </div>

      {/* Lienzo SVG para Conexiones */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        {connections.map((conn, i) => {
          const start = nodes.find(n => n.id === conn.from);
          const end = nodes.find(n => n.id === conn.to);
          if (!start || !end) return null;

          return (
            <g key={i}>
              <path
                d={`M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${start.y}, ${(start.x + end.x) / 2} ${end.y} T ${end.x} ${end.y}`}
                fill="none"
                stroke={selectedNode === conn.to || selectedNode === conn.from ? "#eb671b" : "#cbd5e1"}
                strokeWidth={selectedNode === conn.to || selectedNode === conn.from ? "3" : "2"}
                className="transition-colors duration-300"
              />
            </g>
          );
        })}
      </svg>

      {/* Nodos Interactivos */}
      <div
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleCanvasClick}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        {nodes.map(node => (
          <div
            key={node.id}
            onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
            style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
            className={`absolute cursor-pointer transition-all duration-300 group/node ${node.type === 'root' ? 'z-20' : 'z-10'
              }`}
          >
            {/* Nodo Visual */}
            <div className={`
              relative flex items-center justify-center px-6 py-3 rounded-full border-2 shadow-lg backdrop-blur-sm
              ${selectedNode === node.id
                ? `border-[#eb671b] bg-orange-50 dark:bg-orange-900/30 scale-110 shadow-[#eb671b]/20`
                : `border-white dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 hover:border-[#eb671b]/50`
              }
            `}>
              <span className={`font-semibold whitespace-nowrap ${selectedNode === node.id ? 'text-[#eb671b] dark:text-[#eb671b]' : 'text-slate-700 dark:text-slate-200'}`}>
                {node.label}
              </span>

              {/* Handles simulados para mover (visual only) */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/node:opacity-100 transition-opacity flex flex-col gap-1">
                <button className="bg-slate-200 p-1 rounded-full hover:bg-orange-100 hover:text-[#eb671b]" onClick={(e) => { e.stopPropagation(); moveNode(node.id, 20, 0); }}>→</button>
              </div>
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/node:opacity-100 transition-opacity flex flex-col gap-1">
                <button className="bg-slate-200 p-1 rounded-full hover:bg-orange-100 hover:text-[#eb671b]" onClick={(e) => { e.stopPropagation(); moveNode(node.id, -20, 0); }}>←</button>
              </div>
              <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-opacity flex flex-col gap-1">
                <button className="bg-slate-200 p-1 rounded-full hover:bg-orange-100 hover:text-[#eb671b]" onClick={(e) => { e.stopPropagation(); moveNode(node.id, 0, 20); }}>↓</button>
              </div>
              <div className="absolute left-1/2 -top-10 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-opacity flex flex-col gap-1">
                <button className="bg-slate-200 p-1 rounded-full hover:bg-orange-100 hover:text-[#eb671b]" onClick={(e) => { e.stopPropagation(); moveNode(node.id, 0, -20); }}>↑</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded backdrop-blur">
        Tip: Usa las flechas flotantes al pasar el mouse para mover nodos
      </div>
    </div>
  );
};

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
            <div className="h-full overflow-y-auto pr-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Proyectos Activos", val: "12", trend: "+2", color: "text-[#eb671b]", bg: "bg-orange-50" },
                  { label: "Tareas Pendientes", val: "48", trend: "-5", color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Ideas Generadas", val: "156", trend: "+12", color: "text-purple-600", bg: "bg-purple-50" },
                  { label: "Eficiencia", val: "94%", trend: "+1.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                  <Card key={i} className="p-6 flex items-start justify-between hover:shadow-lg transition-shadow">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.label}</p>
                      <h3 className="text-3xl font-bold mt-1 text-slate-800 dark:text-white">{stat.val}</h3>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${stat.bg} ${stat.color}`}>
                      {stat.trend}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recent Activity & Quick Access */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Resumen de Proyectos</h3>
                    <button className="text-[#eb671b] text-sm font-medium hover:underline">Ver todos</button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-orange-100 group-hover:text-[#eb671b] transition-colors">
                          <Briefcase size={20} />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-200">Lanzamiento Q4</h4>
                          <p className="text-sm text-slate-500">Actualizado hace 2 horas</p>
                        </div>
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#eb671b] w-2/3 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-6">
                  <div className={`bg-gradient-to-br from-[#eb671b] to-orange-700 rounded-2xl p-6 text-white shadow-xl shadow-[#eb671b]/30 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    <h3 className="text-lg font-bold mb-2">Captura una Idea</h3>
                    <p className="text-orange-100 text-sm mb-4">¿Tienes un momento de inspiración? Agrégalo al mapa mental.</p>
                    <button onClick={() => setActiveTab('mindmap')} className="w-full py-2 bg-white text-[#eb671b] rounded-lg font-bold hover:bg-orange-50 transition-colors shadow-sm">
                      Ir al Mapa Mental
                    </button>
                  </div>

                  <Card className="p-5">
                    <h3 className="font-bold mb-4 text-slate-700 dark:text-slate-200">Próximas Entregas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="flex-1 text-slate-600 dark:text-slate-400">Entrega UI Kit</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">Mañana</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="flex-1 text-slate-600 dark:text-slate-400">Revisión Q2</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">Vie, 18</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
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
