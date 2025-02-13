export default function TaskManager({ tasks }: { tasks: any[] }) {
  return (
    <div className='p-4'>
      <table className='min-w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border border-gray-300 p-2'>Task Title</th>
            <th className='border border-gray-300 p-2'>Priority</th>
            <th className='border border-gray-300 p-2'>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td className='border border-gray-300 p-2'>{task.title}</td>
              <td className='border border-gray-300 p-2'>{task.priority}</td>
              <td className='border border-gray-300 p-2'>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
