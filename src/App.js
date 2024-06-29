import React, { useState, useCallback, memo } from 'react';
import './App.css';

const TaskItem = memo(({ task, onAction, isCompleted }) => {
  console.log(`Rendering TaskItem: ${task}`);
  return (
    <li>
      {task}
      {isCompleted ? (
        <>
          <button onClick={() => onAction('delete')}>წაშლა</button>
          <button onClick={() => onAction('moveBack')}>დაბრუნება</button>
        </>
      ) : (
        <button onClick={() => onAction('complete')}>დასრულება</button>
      )}
    </li>
  );
});

const TaskList = memo(({ title, tasks, onTaskAction, isCompleted }) => {
  console.log(`Rendering TaskList: ${title}`);
  return (
    <div className="list">
      <h2>{title}</h2>
      <ul>
        {tasks.map((task, index) => (
          <TaskItem
            key={task}
            task={task}
            onAction={(action) => onTaskAction(index, action)}
            isCompleted={isCompleted}
          />
        ))}
      </ul>
    </div>
  );
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = useCallback(() => {
    if (newTask.trim() !== '') {
      setTasks(prevTasks => [...prevTasks, newTask.trim()]);
      setNewTask('');
    }
  }, [newTask]);

  const handleTaskAction = useCallback((index, action) => {
    switch (action) {
      case 'complete':
        setTasks(prevTasks => {
          const newTasks = [...prevTasks];
          const [completedTask] = newTasks.splice(index, 1);
          setCompletedTasks(prevCompleted => [...prevCompleted, completedTask]);
          return newTasks;
        });
        break;
      case 'delete':
        setCompletedTasks(prevCompleted => prevCompleted.filter((_, i) => i !== index));
        break;
      case 'moveBack':
        setCompletedTasks(prevCompleted => {
          const newCompleted = [...prevCompleted];
          const [movedTask] = newCompleted.splice(index, 1);
          setTasks(prevTasks => [...prevTasks, movedTask]);
          return newCompleted;
        });
        break;
    }
  }, []);

  console.log('Rendering App');
  return (
    <div className="App">
      <h1>To Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="შეიყვანეთ ახალი დავალება"
        />
        <button onClick={addTask}>დამატება</button>
      </div>
      <div className="lists-container">
        <TaskList
          title="შესასრულებელი დავალებები"
          tasks={tasks}
          onTaskAction={handleTaskAction}
          isCompleted={false}
        />
        <TaskList
          title="შესრულებული დავალებები"
          tasks={completedTasks}
          onTaskAction={handleTaskAction}
          isCompleted={true}
        />
      </div>
    </div>
  );
}

export default App;
