import React from 'react';
import Card from '../ui/Card';
import { Briefcase } from 'lucide-react';

const Dashboard = ({ setActiveTab }) => {
    return (
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
    );
}

export default Dashboard;
