import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import ResponsiveDialog from './ResponsiveDialog';
import { useTaskStore } from '@/lib/store';
import TaskForm from './task-form';

export default function TableHeader() {
  const [open, setOpen] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

  const handleAddTask = (task: any) => {
    addTask(task);
    setOpen(false);
  };

  return (
    <div className='py-2'>
      <Button onClick={() => setOpen(true)} variant={'outline'} size={'sm'}>
        <span>
          <Plus />
        </span>
        Create task
      </Button>
      <ResponsiveDialog title={'Create Task'} open={open} setOpen={setOpen}>
        <TaskForm onSubmit={handleAddTask} />
      </ResponsiveDialog>
    </div>
  );
}
