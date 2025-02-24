import React from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useTaskStore } from '@/lib/store';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function BulkTitle({
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
      title: '',
    },
  });

  const onSubmitForm = (data: FormValues) => {
    bulkEdit(taskIds, { title: data.title });
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Enter task title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
