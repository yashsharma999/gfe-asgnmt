import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Ellipsis, Pencil, Plus, Trash } from 'lucide-react';
import { useTaskStore } from '@/lib/store';
import ResponsiveDialog from './ResponsiveDialog';
import TaskForm from './task-form';
import CustomFieldForm from './customFields/custom-field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { toast } from 'sonner';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
          <DropdownMenuItem onClick={handleEdit}>
            <span>
              <Pencil />
            </span>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <span>
              <Trash />
            </span>
            Delete
          </DropdownMenuItem>
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
        <CustomFieldForm task={task} setOpen={setCustomFieldDialogOpen} />
      </ResponsiveDialog>
      <DeleteDialog
        task={task}
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
      />
    </>
  );
}

const DeleteDialog = ({
  task,
  open,
  setOpen,
}: {
  task: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const handleDelete = () => {
    deleteTask(task.id);
    setOpen(false);
    toast.success('Task deleted successfully', {
      description: (
        <p className='text-sm'>
          <span className='font-bold max-w-[200px] truncate'>{task.title}</span>{' '}
          has been deleted successfully
        </p>
      ),
      duration: 10000,
      closeButton: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this task?
        </DialogDescription>
        <DialogFooter>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant={'destructive'} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
