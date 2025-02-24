import React, { useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { fieldToLabel } from '@/lib/utils';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import ResponsiveDialog from '../ResponsiveDialog';
import { toast } from 'sonner';
import { FieldIcon } from '../TaskTable';

export default function CustomFieldLibrary() {
  const { tableColumns } = useTaskStore();

  const customFields = tableColumns.filter((column) => column.custom === true);
  console.log(customFields);

  if (customFields.length === 0) {
    return (
      <div className='flex flex-col gap-2 p-4 px-0'>
        <p className='text-sm text-zinc-500'>No custom fields found</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {customFields.map((field) => (
        <div
          className='border rounded-md py-1 px-2 flex justify-between items-center'
          key={field.field}
        >
          <FieldIcon type={field.type} />
          <p className='text-sm'>{fieldToLabel(field.field)}</p>
          <DeleteCustomField field={field} />
        </div>
      ))}
    </div>
  );
}

const DeleteCustomField = ({ field }: { field: any }) => {
  const { deleteCustomField } = useTaskStore();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteCustomField(field.field);
    setOpen(false);
    toast.success('Custom field deleted successfully', {
      closeButton: true,
      duration: 5000,
    });
  };

  return (
    <>
      <Button
        variant='ghost'
        size='sm'
        className='h-8'
        onClick={() => setOpen(true)}
      >
        <Trash size={6} />
      </Button>
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        title='Delete Custom Field'
      >
        <p>Are you sure you want to delete this custom field?</p>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </ResponsiveDialog>
    </>
  );
};
