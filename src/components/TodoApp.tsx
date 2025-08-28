import { useState, useEffect } from 'react';
import { Sun, Moon, Settings, Check, Trash, Pencil } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: 'normal' | 'urgent' | 'pending';
};

const TodoApp = () => {
  const { theme, setTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      priority: 'normal',
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const updateTodo = () => {
    if (!editingTodo || editingTodo.text.trim() === '') return;
    
    setTodos(
      todos.map((todo) =>
        todo.id === editingTodo.id ? editingTodo : todo
      )
    );
    
    setEditingTodo(null);
  };

  const changePriority = (id: string, priority: 'normal' | 'urgent' | 'pending') => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="todo-container neumorphic-card">
      <header className="todo-header">
        <h1 className="text-2xl font-bold text-foreground">Simple Todo</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="settings-button">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="font-medium mb-2">Theme</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant={theme === 'light' ? 'default' : 'outline'} 
                      onClick={() => setTheme('light')}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" /> Light
                    </Button>
                    <Button 
                      variant={theme === 'dark' ? 'default' : 'outline'} 
                      onClick={() => setTheme('dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" /> Dark
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Clear Data</h3>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setTodos([]);
                      setSettingsOpen(false);
                    }}
                  >
                    Clear All Todos
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="mb-6">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="todo-input"
          />
          <Button type="submit" className="bg-primary text-primary-foreground">
            Add
          </Button>
        </form>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="todo-filters grid grid-cols-3 mb-4">
          <TabsTrigger value="all" className="filter-button">
            All
          </TabsTrigger>
          <TabsTrigger value="active" className="filter-button">
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="filter-button">
            Completed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks yet. Add one above!
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                startEditTodo={startEditTodo}
                changePriority={changePriority}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active tasks. All done!
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                startEditTodo={startEditTodo}
                changePriority={changePriority}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No completed tasks yet.
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                startEditTodo={startEditTodo}
                changePriority={changePriority}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <div className="todo-stats">
        <span>{activeTodosCount} tasks remaining</span>
        <span>{todos.length} total tasks</span>
      </div>

      {/* Edit Todo Dialog */}
      <Dialog open={!!editingTodo} onOpenChange={(open) => !open && setEditingTodo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={editingTodo?.text || ''}
              onChange={(e) => editingTodo && setEditingTodo({ ...editingTodo, text: e.target.value })}
              className="w-full"
            />
            <div>
              <h3 className="font-medium mb-2">Priority</h3>
              <div className="flex gap-2">
                <Button 
                  variant={editingTodo?.priority === 'normal' ? 'default' : 'outline'} 
                  onClick={() => editingTodo && setEditingTodo({ ...editingTodo, priority: 'normal' })}
                >
                  Normal
                </Button>
                <Button 
                  variant={editingTodo?.priority === 'pending' ? 'default' : 'outline'}
                  className="bg-warning text-warning-foreground"
                  onClick={() => editingTodo && setEditingTodo({ ...editingTodo, priority: 'pending' })}
                >
                  Pending
                </Button>
                <Button 
                  variant={editingTodo?.priority === 'urgent' ? 'default' : 'outline'}
                  className="bg-error text-error-foreground"
                  onClick={() => editingTodo && setEditingTodo({ ...editingTodo, priority: 'urgent' })}
                >
                  Urgent
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingTodo(null)}>
                Cancel
              </Button>
              <Button onClick={updateTodo}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type TodoItemProps = {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  startEditTodo: (todo: Todo) => void;
  changePriority: (id: string, priority: 'normal' | 'urgent' | 'pending') => void;
};

const TodoItem = ({ todo, toggleTodo, deleteTodo, startEditTodo, changePriority }: TodoItemProps) => {
  const getTodoItemClass = () => {
    let baseClass = 'todo-item';
    if (todo.completed) {
      baseClass += ' todo-item-completed animate-task-complete';
    } else if (todo.priority === 'urgent') {
      baseClass += ' todo-item-urgent';
    } else if (todo.priority === 'pending') {
      baseClass += ' todo-item-pending';
    }
    return baseClass;
  };

  return (
    <div className={getTodoItemClass()}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="todo-checkbox"
      />
      <span className={todo.completed ? 'todo-text todo-text-completed' : 'todo-text'}>
        {todo.text}
      </span>
      {!todo.completed && (
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${todo.priority === 'urgent' ? 'bg-error-muted text-error' : todo.priority === 'pending' ? 'bg-warning-muted text-warning' : 'bg-muted text-muted-foreground'}`}
            onClick={() => {
              const nextPriority = 
                todo.priority === 'normal' ? 'pending' :
                todo.priority === 'pending' ? 'urgent' : 'normal';
              changePriority(todo.id, nextPriority);
            }}
          >
            {todo.priority === 'normal' ? 'Normal' : 
             todo.priority === 'pending' ? 'Pending' : 'Urgent'}
          </Badge>
        </div>
      )}
      <div className="todo-actions">
        {!todo.completed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="todo-button todo-button-edit"
            onClick={() => startEditTodo(todo)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="todo-button todo-button-delete"
          onClick={() => deleteTodo(todo.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TodoApp;
