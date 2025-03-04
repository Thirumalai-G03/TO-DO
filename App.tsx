import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Filter, X } from 'lucide-react';

// Define the Task interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Filter type
type FilterType = 'all' | 'active' | 'completed';

function App() {
  // State for tasks, new task input, and filter
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;

    const newTaskObj: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date()
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all' filter
  });

  // Get counts for summary
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm">
              <span className="mr-2">{totalTasks} total</span>
              <span className="mr-2">•</span>
              <span className="mr-2">{activeTasks} active</span>
              <span className="mr-2">•</span>
              <span>{completedTasks} completed</span>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="flex items-center text-sm bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-md transition-colors"
              >
                <Filter size={16} className="mr-1" />
                {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Completed'}
              </button>
              
              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 text-gray-800">
                  <div className="py-1">
                    <button 
                      onClick={() => { setFilter('all'); setIsFilterMenuOpen(false); }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${filter === 'all' ? 'bg-indigo-100' : ''}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => { setFilter('active'); setIsFilterMenuOpen(false); }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${filter === 'active' ? 'bg-indigo-100' : ''}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => { setFilter('completed'); setIsFilterMenuOpen(false); }}
                      className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${filter === 'completed' ? 'bg-indigo-100' : ''}`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Add Task Form */}
        <form onSubmit={addTask} className="px-6 py-4 border-b">
          <div className="flex">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus size={20} />
            </button>
          </div>
        </form>
        
        {/* Task List */}
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No tasks found</p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="mt-2 text-indigo-600 hover:text-indigo-800"
                >
                  Show all tasks
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="px-6 py-4 flex items-center">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                    task.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {task.completed && <Check size={14} />}
                </button>
                <span 
                  className={`flex-grow ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
          <p>Click on a task to mark it as completed</p>
        </div>
      </div>
    </div>
  );
}

export default App;