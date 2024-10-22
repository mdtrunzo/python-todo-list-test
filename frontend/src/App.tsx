import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface Task {
  id: number
  task: string
  completed: boolean
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<string>('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks/')
      .then((response) => response.json())
      .then((data: Task[]) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask) return

    fetch('http://127.0.0.1:8000/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: newTask, completed: false }),
    })
      .then((response) => response.json())
      .then((data: Task) => {
        setTasks((prevTasks) => [...prevTasks, data])
        setNewTask('')
        toast.success('Task added', {
          autoClose: 500,
        })
      })
      .catch((error) => console.error('Error adding task:', error))
  }

  const handleCompleteTask = (taskId: number) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
    })
      .then((response) => response.json())
      .then((updatedTask: Task) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        )
        toast.success('Task completed', {
          autoClose: 500,
        })
      })
      .catch((error) => console.error('Error updating task:', error))
  }

  // Handle removing a task
  const handleRemoveTask = (taskId: number) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.status === 204) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
          )
          toast.info('Task removed', {
            autoClose: 500,
          })
        }
      })
      .catch((error) => console.error('Error deleting task:', error))
  }

  return (
    <div>
      <h1>Task List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.completed ? <del>{task.task}</del> : task.task}{' '}
            {task.completed ? '✅' : '❌'}
            {!task.completed && (
              <button onClick={() => handleCompleteTask(task.id)}>
                Complete Task
              </button>
            )}
            <button onClick={() => handleRemoveTask(task.id)}>
              Remove Task
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
