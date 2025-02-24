import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  SquareCheck,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Text,
  Hash,
} from 'lucide-react';
import TaskActions from './TaskActions';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useStore } from 'zustand';
import { useTaskStore } from '@/lib/store';
import { boolean } from 'zod';
import { cn, fieldToLabel } from '@/lib/utils';
import NewTask from './new-task';
import CustomFieldManager from './customFields/manage-custom-fields';
import CustomFilters from './customFields/custom-filters';
import { Separator } from './ui/separator';

type SortDirection = 'asc' | 'desc' | null;
type SortField = any;

interface SortState {
  field: SortField;
  direction: SortDirection;
}

interface FilterState {
  title: string;
  priority: string[];
  status: string[];
  [key: string]: string | string[];
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
}

const ALL_FILTER_VALUE = '_all_';
const statuses = ['Todo', 'In Progress', 'Done'];

export default function TaskTable({
  tasks,
  selectedTasks,
  setSelectedTasks,
}: {
  tasks: any[];
  selectedTasks: any[];
  setSelectedTasks: any;
}) {
  const { tableColumns, updateTask } = useTaskStore();
  const customFields = tableColumns.filter((column) => column.custom === true);

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [sort, setSort] = useState<SortState>({ field: null, direction: null });
  const [filters, setFilters] = useState<FilterState>({
    title: '',
    priority: [],
    status: [],
  });
  const [customFilters, setCustomFilters] = useState<FilterState>();
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
  });

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getPriorityValue = (priority: string) => {
    const priorityOrder: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
      none: 0,
    };
    return priorityOrder[priority.toLowerCase()] ?? -1;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(filters.title.toLowerCase());
    const matchesPriority =
      filters.priority.length === 0 ||
      filters.priority.includes(task.priority.toLowerCase());
    const matchesStatus =
      filters.status.length === 0 ||
      filters.status.includes(task.status.toLowerCase());

    if (
      selectedFields.length > 0 &&
      customFilters &&
      Object.keys(customFilters).length > 0
    ) {
      const matchesCustomFilters = Object.entries(customFilters).every(
        ([field, value]) => {
          if (typeof value === 'string') {
            return task[field].toLowerCase().includes(value.toLowerCase());
          } else if (typeof value === 'number') {
            return task[field] === value;
          } else if (typeof value === 'boolean') {
            return task[field] === value;
          }
          return true;
        }
      );

      return (
        matchesTitle && matchesPriority && matchesStatus && matchesCustomFilters
      );
    }
    return matchesTitle && matchesPriority && matchesStatus;
  });

  const sortedAndFilteredTasks = filteredTasks.sort((a, b) => {
    try {
      if (!sort.field || !sort.direction) return 0;

      if (sort.field === 'priority') {
        const aValue = getPriorityValue(a[sort.field]);
        const bValue = getPriorityValue(b[sort.field]);
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aValue = a[sort.field];
      const bValue = b[sort.field];

      // handle number sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (sort.direction === 'asc') {
        return aValue?.localeCompare(bValue);
      } else {
        return bValue?.localeCompare(aValue);
      }
    } catch (err) {
      console.log(err);
    }
  });

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return 'opacity-20';
    return sort.direction === 'asc' ? 'rotate-0' : 'rotate-180';
  };

  // Get unique values for dropdowns
  const priorities = Array.from(new Set(tasks.map((t) => t.priority)));
  const statuses = Array.from(new Set(tasks.map((t) => t.status)));

  // Calculate pagination values
  const totalItems = sortedAndFilteredTasks.length;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const currentItems = sortedAndFilteredTasks.slice(startIndex, endIndex);

  // Add pagination handlers
  const nextPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, totalPages),
    }));
  };

  const previousPage = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  };

  const changePageSize = (size: string) => {
    setPagination((prev) => ({
      currentPage: 1, // Reset to first page when changing page size
      pageSize: parseInt(size),
    }));
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    setFilters((prev) => {
      let newPriorities = [...prev.priority];

      if (checked) {
        newPriorities.push(priority);
      } else {
        newPriorities = newPriorities.filter((p) => p !== priority);
      }

      return { ...prev, priority: newPriorities };
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters((prev) => {
      let newStatuses = [...prev.status];

      if (checked) {
        newStatuses.push(status.toLowerCase());
      } else {
        newStatuses = newStatuses.filter((s) => s !== status.toLowerCase());
      }

      return { ...prev, status: newStatuses };
    });
  };

  return (
    <div className='space-y-2'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
        <div className='gap-2 flex-wrap flex md:hidden'>
          <NewTask />
          <CustomFieldManager />
        </div>
        <div className='flex gap-2 items-center flex-wrap'>
          <div className=''>
            <Input
              placeholder='Filter by title...'
              value={filters.title}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, title: e.target.value }))
              }
              className='max-w-[200px] h-8 text-sm focus-visible:ring-1 focus-visible:ring-zinc-300 focus-visible:outline-none'
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='h-8 w-fit text-center border-dashed border-zinc-300 dark:border-zinc-700'
              >
                Priority
                {filters.priority.length > 0 && (
                  <>
                    <Separator orientation='vertical' className='h-4' />
                    <div className='flex gap-2 '>
                      {filters.priority.map((priority) => (
                        <span key={priority} className='text-xs text-gray-500'>
                          {fieldToLabel(priority)}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-[180px] p-2'>
              <div className='space-y-2'>
                {priorities.map((priority) => (
                  <div key={priority} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={filters.priority.includes(
                        priority.toLowerCase()
                      )}
                      onCheckedChange={(checked: any) =>
                        handlePriorityChange(
                          priority.toLowerCase(),
                          checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor={`priority-${priority}`}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {fieldToLabel(priority)}
                    </label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='h-8 w-fit justify-between border-dashed border-zinc-300 dark:border-zinc-700'
              >
                Status
                {filters.status.length > 0 && (
                  <>
                    <Separator orientation='vertical' className='h-4' />
                    <div className='flex gap-2 '>
                      {filters.status.map((status) => (
                        <span key={status} className='text-xs text-gray-500'>
                          {fieldToLabel(status)}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-[180px] p-2'>
              <div className='space-y-2'>
                {statuses.map((status) => (
                  <div key={status} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.status.includes(status.toLowerCase())}
                      onCheckedChange={(checked: any) =>
                        handleStatusChange(
                          status.toLowerCase(),
                          checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor={`status-${status}`}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {fieldToLabel(status)}
                    </label>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='gap-2 flex-wrap hidden md:flex'>
          <NewTask />
          <CustomFieldManager />
        </div>
      </div>

      <CustomFilters
        setCustomFilters={setCustomFilters}
        selectedFields={selectedFields}
        setSelectedFields={setSelectedFields}
      />

      <div className='rounded-md overflow-x-auto border border-zinc-200 dark:border-zinc-800'>
        <table className='min-w-full border-collapse text-sm '>
          <thead>
            <tr className='bg-gray-100 dark:bg-zinc-900'>
              <th className='text-left p-2'>
                <Checkbox
                  checked={selectedTasks.length === tasks.length}
                  onCheckedChange={(checked: any) =>
                    setSelectedTasks(checked ? tasks.map((t) => t.id) : [])
                  }
                />
              </th>
              {tableColumns?.map(({ field, label, type }) => {
                if (field === 'id') return;
                return (
                  <th key={field} className='text-left p-2'>
                    <Button
                      variant='ghost'
                      className='h-8 pl-0 !text-xs text-gray-600 flex items-center gap-1 '
                      onClick={() => {
                        if (
                          // added text because of setup in custom-field.tsx
                          // redundant, will remove in future
                          type === 'string' ||
                          type === 'text' ||
                          type === 'number'
                        ) {
                          handleSort(field as SortField);
                        }
                      }}
                    >
                      {<FieldIcon type={type} />}
                      {fieldToLabel(label)}
                      {(type === 'string' ||
                        type === 'text' ||
                        type === 'number') && (
                        <ArrowUpDown
                          className={`h-4 w-4 transition-all ${getSortIcon(
                            field as SortField
                          )}`}
                        />
                      )}
                    </Button>
                  </th>
                );
              })}
              <th className='text-left p-2'></th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.length === 0 && (
              <tr>
                <td
                  colSpan={tableColumns.length + 1}
                  className='text-center p-4'
                >
                  No tasks found
                </td>
              </tr>
            )}
            {currentItems?.length > 0 &&
              currentItems.map((task, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all ease-in-out duration-100',
                    {
                      'bg-zinc-100 dark:bg-zinc-900': selectedTasks.includes(
                        task.id
                      ),
                    }
                  )}
                >
                  <>
                    <td className='p-2'>
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={(checked: any) =>
                          setSelectedTasks((prev: any) =>
                            checked
                              ? [...prev, task.id]
                              : prev.filter((id: any) => id !== task.id)
                          )
                        }
                      />
                    </td>
                    {tableColumns?.map(({ field, label, type, custom }) => {
                      if (field === 'id') return;
                      if (type === 'checkbox') {
                        return (
                          <td key={field} className='p-2'>
                            {
                              <Checkbox
                                checked={task[field]}
                                onCheckedChange={(checked: any) =>
                                  updateTask(task.id, {
                                    [field]: checked,
                                  })
                                }
                              />
                            }
                          </td>
                        );
                      }
                      return (
                        <td
                          key={field}
                          className={cn(`p-2`, {
                            'font-semibold': field === 'title',
                          })}
                        >
                          <FieldLabel
                            field={field}
                            label={task[field]}
                            type={type}
                          />
                        </td>
                      );
                    })}
                    <td className='p-2'>
                      <TaskActions task={task} />
                    </td>
                  </>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Add pagination controls */}
      <div className='flex flex-col sm:flex-row gap-2 items-center justify-between pt-2'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Rows per page:</span>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={changePageSize}
          >
            <SelectTrigger className='w-[80px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-600'>
            {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
          </span>
          <div className='flex gap-1'>
            <Button
              variant='outline'
              size='icon'
              onClick={previousPage}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={nextPage}
              disabled={pagination.currentPage === totalPages}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const FieldIcon = ({ type }: { type: string }) => {
  if (type === 'checkbox')
    return <SquareCheck className='text-gray-500 h-4 w-4' />;
  if (type === 'string') return <Text className=' text-gray-500 h-4 w-4' />;
  if (type === 'text') return <Text className=' text-gray-500 h-4 w-4' />;
  if (type === 'number') return <Hash className=' text-gray-500 h-4 w-4' />;
  return <div className=' bg-zinc-200 rounded-full'></div>;
};

const FieldLabel = ({
  field,
  label,
  type,
}: {
  field: string;
  label: string;
  type: string;
}) => {
  if (field === 'title') {
    return <span>{label}</span>;
  }

  return (
    <div className='flex items-center gap-1'>
      <span>{fieldToLabel(label)}</span>
    </div>
  );
};
