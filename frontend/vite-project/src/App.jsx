import { useState, useEffect } from "react";
import axios from "axios";
import ImportSheet from "./components/ImportSheet";
import TaskTable from "./components/TaskTable";
import TaskForm from "./components/TaskForm";

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]); // ✅ global state

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Task Manager 🚀
        </h1>

        {/* Top Section */}
        <div className="flex justify-between items-start gap-4 mb-6">
          
          <div className="flex-1">
            <ImportSheet />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            
            <div className="bg-white p-6 rounded-lg w-[350px] shadow-lg">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Task</h3>

                <button onClick={() => setShowForm(false)}>✖</button>
              </div>

              {/* ✅ pass refreshTasks */}
              <TaskForm
                closeModal={() => setShowForm(false)}
                refreshTasks={fetchTasks}
              />
            </div>
          </div>
        )}

        {/* ✅ pass tasks + fetch */}
        <TaskTable tasks={tasks} refreshTasks={fetchTasks} />
      </div>
    </div>
  );
};

export default App;