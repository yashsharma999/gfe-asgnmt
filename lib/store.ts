import { create } from 'zustand';
import tasks from './greatfrontend-tasks.json';
import tableColumns from './table-columns.json';
interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
  [key: string]: any; // Allows for custom fields
}

interface TableColumn {
  field: string;
  label: string;
  type: string;
  custom: boolean;
  defaultValue: any;
}

interface CustomField {
  fieldName: string;
  fieldValue: any;
  type: string;
}

interface TaskStore {
  tasks: Task[];
  tableColumns: TableColumn[];
  //customFields: CustomField[];
  initializeTasks: () => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  addCustomField: (
    taskId: number,
    fieldName: string,
    fieldValue: any,
    defaultValue: any,
    type: any
  ) => void;
  deleteCustomField: (fieldName: string) => void;
  //syncTableHeaders: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  tableColumns: [],

  initializeTasks: () => {
    const existingTasks = localStorage.getItem('tasks');
    const existingTableColumns = localStorage.getItem('tableColumns');

    if (!existingTasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      set({ tasks: tasks as Task[] });
    } else {
      set({ tasks: JSON.parse(existingTasks) });
    }

    if (!existingTableColumns) {
      localStorage.setItem('tableColumns', JSON.stringify(tableColumns));
      set({ tableColumns: tableColumns as TableColumn[] });
    } else {
      set({ tableColumns: JSON.parse(existingTableColumns) });
    }
    //get().syncTableHeaders();
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
      const newTasks = [task, ...state.tasks];
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

  addCustomField: (
    taskId: number | null,
    fieldName: string,
    fieldValue: any,
    defaultValue: any,
    type: any
  ) => {
    set((state) => {
      let updatedTasks: Task[] = [];
      if (taskId) {
        updatedTasks = state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, [fieldName]: fieldValue }
            : { ...task, [fieldName]: defaultValue }
        );
      } else {
        updatedTasks = state.tasks.map((task) => {
          return { ...task, [fieldName]: defaultValue };
        });
      }
      // update the task list in local storage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      // update table columns
      const updatedTableColumns = [
        ...state.tableColumns,
        {
          field: fieldName,
          label: fieldName,
          type: type,
          custom: true,
          defaultValue: defaultValue,
        },
      ];

      localStorage.setItem('tableColumns', JSON.stringify(updatedTableColumns));

      return { tasks: updatedTasks, tableColumns: updatedTableColumns };
    });

    //get().syncTableHeaders();
  },

  deleteCustomField: (fieldName: string) => {
    set((state) => {
      const filteredTableColumns = state.tableColumns.filter(
        (column) => column.field !== fieldName
      );

      localStorage.setItem(
        'tableColumns',
        JSON.stringify(filteredTableColumns)
      );

      const updatedTasks = state.tasks.map((task) => {
        delete task[fieldName];
        return task;
      });

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      return { tableColumns: filteredTableColumns, tasks: updatedTasks };
    });
  },

  // syncTableHeaders: () => {
  //   set((state) => {
  //     const allFields = new Set(state.tableColumns.map((col) => col.field));

  //     state.tasks.forEach((task) => {
  //       Object.keys(task).forEach((key) => {
  //         if (!allFields.has(key)) {
  //           allFields.add(key);
  //         }
  //       });
  //     });

  //     const updatedColumns = Array.from(allFields).map((field) => ({
  //       field,
  //       label: field.charAt(0).toUpperCase() + field.slice(1),
  //       type: typeof state.tasks.find((task) => task[field] !== undefined)?.[
  //         field
  //       ],
  //     }));

  //     return { tableColumns: updatedColumns };
  //   });
  // },
}));
