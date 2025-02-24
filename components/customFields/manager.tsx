import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomFieldForm from './custom-field';
import CustomFieldLibrary from './custom-field-lib';

export default function Interface({ setOpen }: { setOpen: any }) {
  return (
    <div>
      <Tabs defaultValue='library'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='library'>Library</TabsTrigger>
          <TabsTrigger value='new'>New</TabsTrigger>
        </TabsList>
        <TabsContent value='library'>
          <CustomFieldLibrary />
        </TabsContent>
        <TabsContent value='new'>
          <CustomFieldForm task={null} setOpen={setOpen} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
