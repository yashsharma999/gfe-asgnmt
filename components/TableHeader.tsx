import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import ResponsiveDialog from './ResponsiveDialog';
import CreateTaskForm from './CreateTaskForm';

export default function TableHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className='py-2'>
      <Button onClick={() => setOpen(true)} variant={'outline'} size={'sm'}>
        <span>
          <Plus />
        </span>
        Create task
      </Button>
      <ResponsiveDialog open={open} setOpen={setOpen}>
        <CreateTaskForm />
      </ResponsiveDialog>
    </div>
  );
}
