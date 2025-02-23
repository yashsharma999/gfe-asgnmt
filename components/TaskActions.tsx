import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Ellipsis, Plus } from 'lucide-react';
import { useTaskStore } from '@/lib/store';
import ResponsiveDialog from './ResponsiveDialog';
import TaskForm from './task-form';
import CustomFieldForm from './customFields/custom-field';

interface TaskActionsProps {
  task: {
    id: number;
    title: string;
    priority: any;
    status: any;
  };
}

export default function TaskActions({ task }: TaskActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [customFieldDialogOpen, setCustomFieldDialogOpen] = useState(false);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleUpdateTask = (updatedTask: any) => {
    updateTask(task.id, updatedTask);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='p-1 h-fit focus-visible:ring-1 focus-visible:ring-zinc-300 focus-visible:outline-none'
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCustomFieldDialogOpen(true)}>
            <span>
              <Plus />
            </span>
            Custom Field
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveDialog
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        title='Edit Task'
      >
        <TaskForm
          onSubmit={handleUpdateTask}
          initialData={task}
          submitLabel='Update Task'
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        title={'Custom field'}
        open={customFieldDialogOpen}
        setOpen={setCustomFieldDialogOpen}
      >
        <CustomFieldForm task={task} />
      </ResponsiveDialog>
    </>
  );
}
