import React from 'react';

export default function TaskTable({ tasks }: { tasks: any[] }) {
  const [selectedCell, setSelectedCell] = React.useState<{
    row: number;
    col: number;
  }>({ row: 0, col: 0 });

  const handleKeyDown = (
    event: React.KeyboardEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    const maxRow = tasks.length - 1;
    const maxCol = 2; // We have 3 columns (0-2)

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        setSelectedCell((prev) => ({
          ...prev,
          row: Math.max(0, prev.row - 1),
        }));
        break;
      case 'ArrowDown':
        event.preventDefault();
        setSelectedCell((prev) => ({
          ...prev,
          row: Math.min(maxRow, prev.row + 1),
        }));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setSelectedCell((prev) => ({
          ...prev,
          col: Math.max(0, prev.col - 1),
        }));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setSelectedCell((prev) => ({
          ...prev,
          col: Math.min(maxCol, prev.col + 1),
        }));
        break;
    }
  };
  return (
    <table className='min-w-full border-collapse border border-gray-300'>
      <thead>
        <tr className='bg-gray-100'>
          <th className='border border-gray-300 p-2'>Task Title</th>
          <th className='border border-gray-300 p-2'>Priority</th>
          <th className='border border-gray-300 p-2'>Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, rowIndex) => (
          <tr key={rowIndex}>
            {['title', 'priority', 'status'].map((field, colIndex) => (
              <td
                key={`${rowIndex}-${colIndex}`}
                className={`border border-gray-300 p-2 ${
                  selectedCell.row === rowIndex && selectedCell.col === colIndex
                    ? 'bg-blue-100 outline outline-2 outline-blue-500'
                    : ''
                }`}
                tabIndex={
                  selectedCell.row === rowIndex && selectedCell.col === colIndex
                    ? 0
                    : -1
                }
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                onClick={() =>
                  setSelectedCell({ row: rowIndex, col: colIndex })
                }
              >
                {task[field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
