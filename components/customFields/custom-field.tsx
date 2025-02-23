import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { labelToFieldName } from '@/lib/utils';

const formSchema = z.object({
  fieldName: z.string().min(2, 'Field name must be at least 2 characters'),
  fieldType: z.enum(['text', 'number', 'checkbox'], {
    errorMap: () => ({ message: 'Invalid field type selected' }),
  }),
  fieldValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  //defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});
//   .refine(
//     (data) => {
//       // Ensure defaultValue matches the selected fieldType
//       if (data.fieldType === 'text' && typeof data.defaultValue !== 'string')
//         return false;
//       if (data.fieldType === 'number' && typeof data.defaultValue !== 'number')
//         return false;
//       if (
//         data.fieldType === 'checkbox' &&
//         typeof data.defaultValue !== 'boolean'
//       )
//         return false;
//       return true;
//     },
//     {
//       message: 'Invalid default value for the selected type',
//       path: ['defaultValue'],
//     }
//   );

type FormValues = z.infer<typeof formSchema>;

export default function CustomFieldForm({ task }: { task: any }) {
  const { addCustomField } = useTaskStore();
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: '',
      fieldType: 'text',
      fieldValue: '',
    },
  });

  const handleDefaultValues = (type: string) => {
    if (type === 'text') {
      return '';
    } else if (type === 'number') {
      return 0;
    } else if (type === 'checkbox') {
      return false;
    }
  };

  function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      fieldName: labelToFieldName(values.fieldName),
      defaultValue: handleDefaultValues(values.fieldType),
      // handle edge case where checkbox is selected but no value is provided
      ...(values.fieldType === 'checkbox' &&
        values.fieldValue === '' && {
          fieldValue: false,
        }),
      // Ensure fieldValue is a Number if fieldType is 'number'
      ...(values.fieldType === 'number' && {
        fieldValue: Number(values.fieldValue),
      }),
    };

    console.log(payload);

    addCustomField(
      task?.id ?? null,
      payload.fieldName,
      payload.fieldValue,
      // if task is not null, use the defaultValue, otherwise use the fieldValue
      task?.id ? payload.defaultValue : payload.fieldValue,
      payload.fieldType
    );

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* Field Name Input */}
        <FormField
          control={form.control}
          name='fieldName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter field name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Field Type Selection */}
        <FormField
          control={form.control}
          name='fieldType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Select field type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='text'>Text</SelectItem>
                  <SelectItem value='number'>Number</SelectItem>
                  <SelectItem value='checkbox'>Checkbox</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='fieldValue'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  {form.watch('fieldType') === 'text' ? (
                    //@ts-ignore
                    <Input placeholder='Enter text' {...field} />
                  ) : form.watch('fieldType') === 'number' ? ( //@ts-ignore
                    <Input type='number' {...field} />
                  ) : (
                    <Input
                      type='checkbox'
                      checked={field.value as boolean}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? true : false)
                      }
                    />
                  )}
                  {/* {form.watch('fieldType') === 'number' && (
                  //@ts-ignore
                  <Input type='number' {...field} />
                )}
                {form.watch('fieldType') === 'checkbox' && (
                  <input
                    type='checkbox'
                    checked={field.value as boolean}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )} */}
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Submit Button */}
        <Button type='submit' className='w-full'>
          Add Field
        </Button>
      </form>
    </Form>
  );
}
