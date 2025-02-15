import React from 'react';
import { Button } from './ui/button';
import { Ellipsis } from 'lucide-react';
import TaskActions from './TaskActions';

export default function TaskTable({ tasks }: { tasks: any[] }) {
  return (
    <div className='rounded-md overflow-hidden border border-zinc-200'>
      <table className='min-w-full border-collapse text-sm'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='text-left p-2'>Task Title</th>
            <th className='text-left p-2'>Priority</th>
            <th className='text-left p-2'>Status</th>
            <th className='text-left p-2'></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, rowIndex) => (
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
  );
}
