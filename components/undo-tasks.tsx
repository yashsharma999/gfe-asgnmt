import { useTaskStore } from '@/lib/store';
import React from 'react';
import { Button } from './ui/button';
import { Undo2 } from 'lucide-react';

export default function UndoTasks() {
  const { undoState, executeUndo } = useTaskStore();
  if (undoState.length === 0) return null;

  return (
    <Button
      className='h-8 shadow-sm'
      variant='outline'
      onClick={() => executeUndo()}
    >
      <Undo2 className='h-4 w-4' />
      Undo
    </Button>
  );
}
