import React, { useEffect, useState } from 'react'

// Define the TypeScript type for a Task
interface Task {
  id: number
  task: string
  completed: boolean
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]) // Specify Task[] as the type

  // Fetch tasks from the Django API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then((response) => response.json())
      .then((data: Task[]) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error))
  }, [])

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.task} {task.completed ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
