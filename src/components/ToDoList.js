import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState(new Date());
  const [editing, setEditing] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [showOptions, setShowOptions] = useState(null);

  // Add a new task
  const addTask = () => {
    if (!task) return;
    const newTask = { id: Date.now(), task, date, completed: false, reminded: false };
    setTasks([...tasks, newTask]);
    setTask('');
    setDate(new Date());
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Edit a task
  const editTask = (id) => {
    const selectedTask = tasks.find((t) => t.id === id);
    setTask(selectedTask.task);
    setDate(new Date(selectedTask.date));
    setEditing(id);
    setShowOptions(null); // Close options
  };

  // Save edited task
  const saveEdit = () => {
    setTasks(tasks.map((t) =>
      t.id === editing ? { ...t, task, date } : t
    ));
    setEditing(null);
    setTask('');
    setDate(new Date());
  };

  // Mark task as completed
  const toggleComplete = (id) => {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // Check for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const dueTask = tasks.find(
        (t) =>
          new Date(t.date).toLocaleString() === now.toLocaleString() &&
          !t.reminded
      );
      if (dueTask) {
        setReminder(dueTask);
        setTasks(tasks.map((t) =>
          t.id === dueTask.id ? { ...t, reminded: true } : t
        ));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="todo-container">
      <h2>Manage Your Tasks</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
        {editing ? (
          <button onClick={saveEdit}>Save</button>
        ) : (
          <button onClick={addTask}>Add Task</button>
        )}
      </div>
      <div className="task-list">
        {tasks.map((t) => (
          <div className="task-item" key={t.id}>
            <div className="task-details">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(t.id)}
              />
              <span className={t.completed ? 'completed' : ''}>{t.task}</span>
              <span className="task-date">{new Date(t.date).toLocaleString()}</span>
            </div>
            <div className="task-actions">
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className="options-icon"
                onClick={() => setShowOptions(t.id === showOptions ? null : t.id)}
              />
              {showOptions === t.id && (
                <div className="options-menu">
                  <button onClick={() => editTask(t.id)}>
                    <FontAwesomeIcon icon={faPen} /> Edit
                  </button>
                  <button onClick={() => deleteTask(t.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Reminder Modal */}
      {reminder && (
        <div className="reminder">
          <h2>Reminder</h2>
          <p>{reminder.task}</p>
          <button onClick={() => setReminder(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ToDoList;
