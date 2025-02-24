import { useTaskStore } from '@/lib/store';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge, ChevronDown, Filter, Plus, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { fieldToLabel } from '@/lib/utils';
import { Separator } from '../ui/separator';

export default function CustomFilters({
  setCustomFilters,
  selectedFields,
  setSelectedFields,
}: {
  setCustomFilters: any;
  selectedFields: string[];
  setSelectedFields: any;
}) {
  const { tableColumns } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleFieldSelection = (field: string, checked: boolean) => {
    if (checked) {
      setSelectedFields((prev: any) => [...prev, field]);
    } else {
      setSelectedFields((prev: any) => prev.filter((f: any) => f !== field));

      // remove the field from the custom filters
      setCustomFilters((prev: any) => {
        const newFilters = { ...prev };
        delete newFilters[field];
        return newFilters;
      });
    }
  };

  const customFields = tableColumns.filter((column) => column.custom === true);

  if (customFields.length === 0) {
    return null;
  }

  return (
    <div className='flex gap-2'>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className='text-sm h-8 shadow-sm'
            variant={'outline'}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Filter />
            Add Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className='flex flex-col gap-2'>
            {customFields.map((field) => (
              <DropdownMenuItem key={field.field}>
                <div className='text-sm flex w-full justify-between items-center'>
                  <p>{field.label}</p>
                  <Checkbox
                    onClick={(ev) => {
                      ev.stopPropagation();
                    }}
                    checked={selectedFields.includes(field.field)}
                    onCheckedChange={(checked) => {
                      handleFieldSelection(field.field, checked as boolean);
                    }}
                  />
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className='flex gap-2 flex-wrap'>
        {selectedFields.map((field) => {
          const fieldData = tableColumns.find((f) => f.field === field);
          console.log(fieldData);
          if (fieldData?.type === 'text') {
            return (
              <CustomFilterWrapper
                key={field}
                label={fieldData?.label}
                setCustomFilters={setCustomFilters}
                setSelectedFields={setSelectedFields}
              >
                <Input
                  placeholder={`Filter by ${fieldData?.label}`}
                  key={field}
                  className='h-6 bg-slate-100 text-sm max-w-[150px]'
                  onChange={(e) => {
                    setCustomFilters((prev: any) => ({
                      ...prev,
                      [field]: e.target.value,
                    }));
                  }}
                />
              </CustomFilterWrapper>
            );
          } else if (fieldData?.type === 'number') {
            return (
              <CustomFilterWrapper
                key={field}
                label={fieldData?.label}
                setCustomFilters={setCustomFilters}
                setSelectedFields={setSelectedFields}
              >
                <Input
                  placeholder={`Filter by number ${fieldData?.label}`}
                  key={field}
                  type='number'
                  className='h-6 bg-slate-100 text-sm max-w-[100px]'
                  defaultValue={0}
                  onChange={(e) => {
                    setCustomFilters((prev: any) => ({
                      ...prev,
                      [field]: Number(e.target.value),
                    }));
                  }}
                />
              </CustomFilterWrapper>
            );
          } else if (fieldData?.type === 'checkbox') {
            return (
              <CustomFilterWrapper
                key={field}
                label={fieldData?.label}
                setCustomFilters={setCustomFilters}
                setSelectedFields={setSelectedFields}
              >
                <Checkbox
                  defaultChecked={false}
                  onCheckedChange={(checked) => {
                    setCustomFilters((prev: any) => ({
                      ...prev,
                      [field]: checked,
                    }));
                  }}
                />
              </CustomFilterWrapper>
            );
          }
        })}
      </div>
    </div>
  );
}

const CustomFilterWrapper = ({
  children,
  label,
  setCustomFilters,
  setSelectedFields,
}: {
  children: React.ReactNode;
  label: string;
  setCustomFilters: any;
  setSelectedFields: any;
}) => {
  return (
    <div className='relative border border-dashed border-zinc-300 rounded-md flex justify-center p-[2px] px-2 items-center gap-2'>
      <p className='text-xs text-zinc-500'>{fieldToLabel(label)}</p>
      <Separator orientation='vertical' className='h-[80%]' />
      {children}
      <button
        onClick={() => {
          setCustomFilters((prev: any) => {
            const newFilters = { ...prev };
            delete newFilters[label];
            return newFilters;
          });
          setSelectedFields((prev: any) =>
            prev.filter((f: any) => f !== label)
          );
        }}
        className='absolute top-[-8px] right-[-8px] bg-white border border-zinc-300 rounded-full text-xs p-[2px] h-4 w-4 flex items-center justify-center'
      >
        <X className='w-3 h-3' />
      </button>
    </div>
  );
};
