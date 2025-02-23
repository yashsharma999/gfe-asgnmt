import { useTaskStore } from '@/lib/store';
import React, { useState } from 'react';
import ResponsiveDialog from './ResponsiveDialog';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import TaskForm from './task-form';

export default function NewTask() {
  const [open, setOpen] = useState(false);
  const addTask = useTaskStore((state) => state.addTask);

  const handleAddTask = (task: any) => {
    addTask(task);
    setOpen(false);
  };

  return (
    <div className='py-2'>
      <Button
        onClick={() => setOpen(true)}
        variant={'outline'}
        className='h-8 shadow-sm'
        size={'sm'}
      >
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
