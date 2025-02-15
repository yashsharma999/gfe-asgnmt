import { useState } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';

interface ResponsiveDialogProps {
  open: boolean;
  setOpen: any;
  children: React.ReactNode;
}

export default function ResponsiveDialog({
  open,
  setOpen,
  children,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>Create task</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Create Task</DrawerTitle>
          <DrawerDescription>Create task</DrawerDescription>
        </DrawerHeader>
        <div className='px-4'>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
