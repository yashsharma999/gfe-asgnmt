import { create } from 'zustand';
import tasks from './greatfrontend-tasks.json';

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
}

interface TaskStore {
  tasks: Task[];
  initializeTasks: () => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  initializeTasks: () => {
    const existingTasks = localStorage.getItem('tasks');
    if (!existingTasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      set({ tasks: tasks as Task[] });
    } else {
      set({ tasks: JSON.parse(existingTasks) });
    }
  },

  updateTask: (taskId, updates) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { tasks: updatedTasks };
    });
  },

  addTask: (task) => {
    set((state) => {
      const newTasks = [...state.tasks, task];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },

  deleteTask: (taskId) => {
    set((state) => {
      const filteredTasks = state.tasks.filter((task) => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(filteredTasks));
      return { tasks: filteredTasks };
    });
  },
}));
