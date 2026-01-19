import React from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AlertCircle, Clock, CheckCircle2, Plus, MoreHorizontal } from 'lucide-react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Column Definitions ---
const COLUMNS = [
    { id: "todo", title: "Por Hacer", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500" },
    { id: "inprogress", title: "En Progreso", icon: Clock, color: "text-blue-500", bg: "bg-blue-500" },
    { id: "done", title: "Completado", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500" }
];

// --- Sortable Task Item ---
const SortableTask = ({ task, id }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="p-4 hover:shadow-md transition-shadow group touch-none">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${task.tag === 'Estrategia' ? 'bg-purple-100 text-purple-600' :
                            task.tag === 'Diseño' ? 'bg-pink-100 text-pink-600' :
                                task.tag === 'Finanzas' ? 'bg-green-100 text-green-600' :
                                    'bg-slate-100 text-slate-600'
                        }`}>
                        {task.tag}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 text-start">{task.title}</h4>

                <div className="flex items-center justify-between mt-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                    <div className="flex -space-x-2">
                        {[...Array(task.members || 1)].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-[#eb671b] border-2 border-white dark:border-slate-800" />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

// --- Droppable Column ---
const KanbanColumn = ({ column, tasks }) => {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column
        }
    });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[300px] flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.bg}`} />
                    <h3 className="font-bold text-slate-700 dark:text-slate-200">{column.title}</h3>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
                <Button variant="ghost" className="!p-1"><Plus size={16} /></Button>
            </div>

            <div className="flex-1 flex flex-col gap-3 p-1 rounded-xl">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <SortableTask key={task.id} id={task.id} task={task} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                        Soltar aquí
                    </div>
                )}

                <button className={`w-full py-3 mt-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:border-[#eb671b] hover:text-[#eb671b] transition-colors flex items-center justify-center gap-2 font-medium text-sm`}>
                    <Plus size={16} /> Agregar Tarea
                </button>
            </div>
        </div>
    );
};

const KanbanBoard = () => {
    const [tasks, setTasks] = useLocalStorage('plotnexus-kanban-tasks', [
        { id: "task-1", title: "Análisis de Mercado Q1", tag: "Estrategia", status: "todo", members: 3 },
        { id: "task-2", title: "Diseño de Prototipo App", tag: "Diseño", status: "inprogress", members: 2 },
        { id: "task-3", title: "Reunión con Inversores", tag: "Finanzas", status: "done", members: 5 },
        { id: "task-4", title: "Campaña de Marketing", tag: "Marketing", status: "todo", members: 1 },
    ]);

    const [activeId, setActiveId] = React.useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';
        const isOverColumn = over.data.current?.type === 'Column';

        if (!isActiveTask) return;

        // I'm dragging a task over another task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].status !== tasks[overIndex].status) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex].status = tasks[overIndex].status;
                    return arrayMove(newTasks, activeIndex, overIndex - 1); // simple status switch logic
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        // I'm dragging a task over a column
        if (isActiveTask && isOverColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const newTasks = [...tasks];
                newTasks[activeIndex].status = overId; // column id is the status
                return arrayMove(newTasks, activeIndex, activeIndex);
            });
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        // If dropped over a column
        if (COLUMNS.some(col => col.id === overId)) {
            if (activeTask.status !== overId) {
                setTasks(tasks.map(t => t.id === activeId ? { ...t, status: overId } : t));
            }
            return;
        }

        // If dropped over another task
        const overTask = tasks.find(t => t.id === overId);
        if (overTask && activeTask.status === overTask.status) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
            if (activeIndex !== overIndex) {
                setTasks(arrayMove(tasks, activeIndex, overIndex));
            }
        }
    };

    const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

    return (
        <div className="h-full overflow-x-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 min-w-[1000px] pb-4 h-full">
                    {COLUMNS.map(col => (
                        <KanbanColumn
                            key={col.id}
                            column={col}
                            tasks={tasks.filter(t => t.status === col.id)}
                        />
                    ))}
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeTask ? <SortableTask task={activeTask} id={activeTask.id} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
