import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definition for Todo
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// SVG Icons
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const CrossIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// TodoItem Component
const TodoItem: React.FC<{
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}> = React.memo(({ todo, onToggle, onDelete }) => (
  <motion.li 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`
      flex items-center justify-between p-2 rounded-lg 
      ${todo.completed ? 'bg-green-50 line-through text-gray-500' : 'bg-white'}
      hover:bg-gray-50 transition-colors duration-200
    `}
  >
    <span className="flex-grow">{todo.text}</span>
    <div className="flex space-x-2">
      <button 
        onClick={() => onToggle(todo.id)}
        className={`
          p-1 rounded-full transition-colors duration-200
          ${todo.completed ? 'text-green-500 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}
        `}
      >
        {todo.completed ? <CheckIcon /> : <CrossIcon />}
      </button>
      <button 
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors duration-200"
      >
        <TrashIcon />
      </button>
    </div>
  </motion.li>
));

// Main Component
function App() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Memoized expensive computation
  const expensiveTodoComputation = useMemo(() => {
    console.log('Performing expensive todo computation');
    return todos.length * 100;
  }, [todos]);

  // Memoized completed todos count
  const completedTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  // Increment counter
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  // Add todo with validation
  const addTodo = useCallback(() => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos(prev => [...prev, newTodo]);
      setInputValue('');
    }
  }, [inputValue]);

  // Toggle todo completion
  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // Delete todo
  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-xl p-6"
        >
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            UseMemo Performance Demo
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium">Counter: {count}</span>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={increment}
                className="
                  bg-blue-500 text-white px-3 py-1 rounded-full 
                  hover:bg-blue-600 transition-colors flex items-center
                "
              >
                <PlusIcon /> Increment
              </motion.button>
            </div>
            <div className="text-gray-600">
              Computation Result: {expensiveTodoComputation}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Todo List
          </h2>
          
          <div className="flex mb-4 space-x-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Enter a new todo" 
              className="
                flex-grow px-3 py-2 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
              className="
                bg-green-500 text-white px-4 py-2 rounded-lg 
                hover:bg-green-600 transition-colors flex items-center
              "
            >
              <PlusIcon /> Add Todo
            </motion.button>
          </div>

          <div className="mb-4 text-gray-600">
            Total Todos: {todos.length} | 
            Completed: {completedTodosCount}
          </div>

          <AnimatePresence>
            <ul className="space-y-2">
              {todos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </ul>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default App;