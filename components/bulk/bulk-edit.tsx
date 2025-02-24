import React from 'react';
import BulkTitle from './title';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import BulkPriority from './priority';
import BulkStatus from './status';

export default function BulkEdit({
  taskIds,
  onClose,
}: {
  taskIds: number[];
  onClose: () => void;
}) {
  return (
    <Tabs defaultValue='title' className='w-full'>
      <TabsList className='w-full'>
        <TabsTrigger value='title' className='w-full'>
          Title
        </TabsTrigger>
        <TabsTrigger value='status' className='w-full'>
          Status
        </TabsTrigger>
        <TabsTrigger value='priority' className='w-full'>
          Priority
        </TabsTrigger>
      </TabsList>
      <TabsContent value='title'>
        <BulkTitle taskIds={taskIds} onClose={onClose} />
      </TabsContent>
      <TabsContent value='status'>
        <BulkStatus taskIds={taskIds} onClose={onClose} />
      </TabsContent>
      <TabsContent value='priority'>
        <BulkPriority taskIds={taskIds} onClose={onClose} />
      </TabsContent>
    </Tabs>
  );
}
