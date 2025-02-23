import React, { useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { fieldToLabel } from '@/lib/utils';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import ResponsiveDialog from '../ResponsiveDialog';

export default function CustomFieldLibrary() {
  const { tableColumns } = useTaskStore();

  const customFields = tableColumns.filter((column) => column.custom === true);
  console.log(customFields);
  return (
    <div className='flex flex-col gap-2'>
      {customFields.map((field) => (
        <div
          className='border rounded-md py-1 px-2 flex justify-between items-center'
          key={field.field}
        >
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
