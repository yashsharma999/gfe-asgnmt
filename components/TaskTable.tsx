import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import TaskActions from './TaskActions';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'title' | 'priority' | 'status' | null;

interface SortState {
  field: SortField;
  direction: SortDirection;
}

interface FilterState {
  title: string;
  priority: string;
  status: string;
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
}

const ALL_FILTER_VALUE = '_all_';

export default function TaskTable({ tasks }: { tasks: any[] }) {
  const [sort, setSort] = useState<SortState>({ field: null, direction: null });
  const [filters, setFilters] = useState<FilterState>({
    title: '',
    priority: ALL_FILTER_VALUE,
    status: ALL_FILTER_VALUE,
  });
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

  const filteredTasks = [...tasks].filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(filters.title.toLowerCase());
    const matchesPriority =
      filters.priority === ALL_FILTER_VALUE ||
      task.priority.toLowerCase() === filters.priority;
    const matchesStatus =
      filters.status === ALL_FILTER_VALUE ||
      task.status.toLowerCase() === filters.status;

    return matchesTitle && matchesPriority && matchesStatus;
  });

  const sortedAndFilteredTasks = filteredTasks.sort((a, b) => {
    if (!sort.field || !sort.direction) return 0;

    if (sort.field === 'priority') {
      const aValue = getPriorityValue(a[sort.field]);
      const bValue = getPriorityValue(b[sort.field]);
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (sort.direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
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

  return (
    <div className='space-y-4'>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <Input
            placeholder='Filter by title...'
            value={filters.title}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, title: e.target.value }))
            }
            className='max-w-sm'
            //prefix={<Search className='h-4 w-4 text-gray-400' />}
          />
        </div>
        <Select
          value={filters.priority}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, priority: value }))
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by priority' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER_VALUE}>All priorities</SelectItem>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority.toLowerCase()}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FILTER_VALUE}>All statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status.toLowerCase()}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md overflow-hidden border border-zinc-200'>
        <table className='min-w-full border-collapse text-sm'>
          <thead>
            <tr className='bg-gray-100'>
              {[
                { field: 'title' as const, label: 'Task Title' },
                { field: 'priority' as const, label: 'Priority' },
                { field: 'status' as const, label: 'Status' },
              ].map(({ field, label }) => (
                <th key={field} className='text-left p-2'>
                  <Button
                    variant='ghost'
                    className='h-8 pl-0 flex items-center gap-1 font-medium'
                    onClick={() => handleSort(field)}
                  >
                    {label}
                    <ArrowUpDown
                      className={`h-4 w-4 transition-all ${getSortIcon(field)}`}
                    />
                  </Button>
                </th>
              ))}
              <th className='text-left p-2'></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((task, rowIndex) => (
              <tr key={rowIndex} className='border-b border-zinc-200'>
                <td className='p-2'>{task.title}</td>
                <td className='p-2'>{task.priority}</td>
                <td className='p-2'>{task.status}</td>
                <td className='p-2'>
                  <TaskActions task={task} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add pagination controls */}
      <div className='flex items-center justify-between pt-4'>
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
