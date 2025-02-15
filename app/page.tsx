'use client';

import { useEffect, useState } from 'react';
import tasks from '@/lib/greatfrontend-tasks.json';
import { ModeToggle } from '@/components/ModeToggle';
import TaskManager from '@/components/TaskManager';

function loadTasksToLocalStorage() {
  // Only run on client side since localStorage is not available on server
  if (typeof window !== 'undefined') {
    const existingTasks = localStorage.getItem('tasks');

    // Only set tasks if they haven't been set before
    if (!existingTasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));

      return tasks;
    } else {
      return JSON.parse(existingTasks);
    }
  }
}

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = loadTasksToLocalStorage();
    setData(data);
  }, []);

  return (
    <section>
      {/* <ModeToggle /> */}
      <div className='max-w-7xl mx-auto'>
        <TaskManager tasks={data} />
      </div>
    </section>
  );
}
