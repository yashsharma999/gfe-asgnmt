'use client';

import { useEffect } from 'react';
import { ModeToggle } from '@/components/ModeToggle';
import TaskManager from '@/components/TaskManager';
import { useTaskStore } from '@/lib/store';

export default function Home() {
  const { tasks, initializeTasks } = useTaskStore();

  useEffect(() => {
    initializeTasks();
  }, []);

  return (
    <section>
      {/* <ModeToggle /> */}
      <div className='max-w-7xl mx-auto'>
        <TaskManager tasks={tasks} />
      </div>
    </section>
  );
}
