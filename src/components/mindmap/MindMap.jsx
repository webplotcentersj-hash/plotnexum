import React, { useState, useRef } from 'react';
import { Plus, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const MindMap = () => {
    const [nodes, setNodes] = useLocalStorage('plotnexus-mindmap-nodes', [
        { id: 1, x: 400, y: 300, label: "Idea Central", type: "root" },
        { id: 2, x: 250, y: 150, label: "Marketing", type: "child" },
        { id: 3, x: 550, y: 150, label: "Producto", type: "child" },
        { id: 4, x: 250, y: 450, label: "Ventas", type: "child" },
        { id: 5, x: 550, y: 450, label: "Finanzas", type: "child" },
    ]);

    const [connections, setConnections] = useLocalStorage('plotnexus-mindmap-connections', [
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

export default MindMap;
