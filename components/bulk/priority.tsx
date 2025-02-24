import React from 'react';
import { FormField, FormLabel } from '../ui/form';
import { FormItem } from '../ui/form';
import { Select, SelectValue } from '../ui/select';
import { SelectTrigger } from '../ui/select';
import { SelectContent } from '../ui/select';
import { SelectItem } from '../ui/select';
import { FormControl } from '../ui/form';
import { FormMessage } from '../ui/form';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useTaskStore } from '@/lib/store';

const formSchema = z.object({
  priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']),
});

type FormValues = z.infer<typeof formSchema>;

export default function BulkPriority({
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
      priority: 'medium',
    },
  });

  const onSubmitForm = (data: FormValues) => {
    bulkEdit(taskIds, { priority: data.priority });
    onClose();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className='space-y-6'>
        <FormField
          control={form.control}
          name='priority'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
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
                  <SelectItem value='none'>None</SelectItem>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                  <SelectItem value='urgent'>Urgent</SelectItem>
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
