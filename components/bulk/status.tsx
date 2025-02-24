import React from 'react';
import { FormField, FormLabel } from '../ui/form';
import { FormItem } from '../ui/form';
import { Select, SelectValue } from '../ui/select';
import { SelectTrigger } from '../ui/select';
import { SelectContent } from '../ui/select';
import { SelectItem } from '../ui/select';
import { FormControl } from '../ui/form';
import { FormMessage } from '../ui/form';
import { Form, useForm, FormProvider } from 'react-hook-form'; // Ensure FormProvider is imported
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useTaskStore } from '@/lib/store';

const formSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']),
});

type FormValues = z.infer<typeof formSchema>;

export default function BulkStatus({
  taskIds,
  onClose,
}: {
  taskIds: number[];
  onClose: () => void;
}) {
  const { bulkEdit } = useTaskStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'not_started',
    },
  });

  const onSubmitForm = (data: FormValues) => {
    bulkEdit(taskIds, { status: data.status });
    onClose();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className='space-y-6'>
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => value && field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select task priority' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='not_started'>Not Started</SelectItem>
                  <SelectItem value='in_progress'>In Progress</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </FormProvider>
  );
}
