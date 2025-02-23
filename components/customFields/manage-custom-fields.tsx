import { useTaskStore } from '@/lib/store';
import React, { useState } from 'react';
import ResponsiveDialog from '../ResponsiveDialog';
import { Settings } from 'lucide-react';
import { Button } from '../ui/button';
import Interface from './manager';

export default function CustomFieldManager() {
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
          <Settings />
        </span>
        Manage Custom Fields
      </Button>
      <ResponsiveDialog
        title={'Manage Custom Fields'}
        open={open}
        setOpen={setOpen}
      >
        <Interface />
      </ResponsiveDialog>
    </div>
  );
}
