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
  title: string;
  description?: string;
}

export default function ResponsiveDialog({
  open,
  setOpen,
  children,
  title,
  description,
}: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description ?? ''}</DialogDescription>
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
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description ?? ''}</DrawerDescription>
        </DrawerHeader>
        <div className='px-4 pb-8'>{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
