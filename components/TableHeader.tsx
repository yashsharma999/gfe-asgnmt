import React, { useState } from 'react';
import { ModeToggle } from './ModeToggle';

export default function TableHeader() {
  return (
    <div className='flex justify-end'>
      <ModeToggle />
    </div>
  );
}
