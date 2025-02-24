import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';
import { useTaskStore } from '@/lib/store';
import { fieldToLabel } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    id: number;
    title: string;
    priority: 'none' | 'low' | 'medium' | 'high' | 'urgent';
    status: 'not_started' | 'in_progress' | 'completed';
    [key: string]: any;
  };
  submitLabel?: string;
}

export default function TaskForm({
  onSubmit,
  initialData,
  submitLabel = 'Create Task',
}: TaskFormProps) {
  const { tableColumns } = useTaskStore();
  console.log(tableColumns);

  const customColumns = tableColumns?.filter(
    (column) => column.custom === true
  );

  const formSchema = z.object({
    id: z.number(),
    title: z.string().min(1, 'Title is required'),
    status: z.enum(['not_started', 'in_progress', 'completed']),
    priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']),
    ...(customColumns?.reduce((acc, column) => {
      // @ts-ignore
      acc[column.field] =
        column.type === 'checkbox'
          ? z.boolean()
          : column.type === 'number'
          ? z.number()
          : z.string();
      return acc;
    }, {}) || {}),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: Math.random(),
      title: '',
      status: 'not_started',
      priority: 'medium',
      ...(customColumns?.reduce((acc, column) => {
        // @ts-ignore
        acc[column.field] = column.defaultValue;
        return acc;
      }, {}) || {}),
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  function onSubmitForm(values: any) {
    const payload = {
      ...values,
      ...(customColumns?.reduce((acc, column) => {
        // @ts-ignore
        acc[column.field] =
          column.type === 'number'
            ? Number(values[column.field])
            : values[column.field];
        return acc;
      }, {}) || {}),
    };
    onSubmit(payload);

    toast.success(`Task ${initialData ? 'updated' : 'created'} successfully`, {
      closeButton: true,
      duration: 5000,
    });
  }

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

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => value && field.onChange(value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select task status' />
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

        {customColumns?.map((column) => (
          <FormField
            key={column.field}
            control={form.control}
            // @ts-ignore
            name={column.field as string}
            render={({ field }) => {
              if (column.type === 'checkbox') {
                return (
                  <FormItem className='flex items-center gap-2'>
                    <FormLabel>{fieldToLabel(column.field)}</FormLabel>
                    <FormControl>
                      <Checkbox
                        className='!mt-0'
                        // @ts-ignore
                        checked={field.value === true ? true : false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                );
              }
              return (
                <FormItem>
                  <FormLabel>{fieldToLabel(column.field)}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${column.label}`}
                      type={column.type === 'number' ? 'number' : 'text'}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
        ))}
        <div className='flex justify-end'>
          <Button type='submit'>{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
