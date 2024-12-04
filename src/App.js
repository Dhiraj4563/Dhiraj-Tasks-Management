import React from 'react';
import ToDoList from './components/ToDoList';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <h1>Daily Data</h1>
      <ToDoList />
    </div>
  );
};

export default App;
