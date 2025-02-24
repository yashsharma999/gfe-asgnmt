import React, { useEffect, useState } from 'react';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import ResponsiveDialog from './ResponsiveDialog';
import { ClipboardList, Pencil, Trash } from 'lucide-react';
import TaskForm from './task-form';
import BulkEdit from './bulk/bulk-edit';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useTaskStore } from '@/lib/store';
import UndoTasks from './undo-tasks';

export default function TableHeader({
  selectedTasks,
}: {
  selectedTasks: any[];
}) {
  const { bulkDelete: handleBulkDelete } = useTaskStore();

  const [bulkOperation, setBulkOperation] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [bulkEdit, setBulkEdit] = useState<boolean>(false);
  const [bulkDelete, setBulkDelete] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTasks.length > 0) {
      setBulkOperation(true);
    } else {
      setBulkOperation(false);
    }
  }, [selectedTasks]);

  const handleBulkEdit = (task: any) => {
    //addTask(task);
    console.log(task);
    setBulkEdit(false);
  };

  return (
    <>
      <div className='flex justify-between'>
        <h1 className='font-bold flex items-center gap-2'>
          <span>
            <ClipboardList />{' '}
          </span>
          Task Manager
        </h1>
        <div className='flex items-center gap-2'>
          <UndoTasks />
          {bulkOperation && (
            <Button
              variant='outline'
              className='h-8 shadow-sm ease-in transition-all duration-300'
              onClick={() => setOpen(true)}
            >
              Bulk Actions
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title='Bulk Actions'
        description='Select the actions you want to perform on the selected tasks'
      >
        <div className='flex flex-col gap-2'>
          <div className='border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md p-2'>
            <Button
              variant='default'
              className='h-8 shadow-sm w-full'
              onClick={() => setBulkEdit(true)}
            >
              <Pencil className='h-4 w-4' />
              Edit
            </Button>
          </div>
          <div className='border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md p-2'>
            <Button
              onClick={() => setBulkDelete(true)}
              variant='destructive'
              className='h-8 shadow-sm w-full'
            >
              <Trash className='h-4 w-4' />
              Delete
            </Button>
          </div>
        </div>
      </ResponsiveDialog>
      <ResponsiveDialog
        title={'Bulk Edit'}
        description='This will edit all the selected fields to the same value'
        open={bulkEdit}
        setOpen={setBulkEdit}
      >
        <BulkEdit
          taskIds={selectedTasks}
          onClose={() => {
            setBulkEdit(false);
            setOpen(false);
          }}
        />
      </ResponsiveDialog>
      <Dialog open={bulkDelete} onOpenChange={setBulkDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Delete</DialogTitle>
            <DialogDescription>
              This will delete all the selected tasks
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setBulkDelete(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleBulkDelete(selectedTasks);
                setBulkDelete(false);
                setOpen(false);
              }}
              variant='destructive'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
