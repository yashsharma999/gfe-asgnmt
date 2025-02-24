import { useState } from 'react';
import React from 'react';
import TaskTable from './TaskTable';
import TaskHeader from './TableHeader';
import TableHeader from './TableHeader';

export default function TaskManager({ tasks }: { tasks: any[] }) {
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);

  return (
    <div className='p-4'>
      <TableHeader selectedTasks={selectedTasks} />
      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTasks}
        setSelectedTasks={setSelectedTasks}
      />
    </div>
  );
}
