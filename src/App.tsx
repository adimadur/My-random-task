import { useState } from 'react';
import { ThemeProvider } from './components/theme-provider';
import TodoApp from './components/TodoApp';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="todo-theme">
      <div className="min-h-screen bg-background">
        <TodoApp />
      </div>
    </ThemeProvider>
  );
}

export default App;
