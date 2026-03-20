import axios from "axios";

export default function TaskTable({ tasks = [], refreshTasks }) {

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      refreshTasks && refreshTasks(); // ✅
    } catch (err) {
      console.log(err);
    }
  };

  // Edit
  const handleEdit = async (task) => {
  const newTitle = window.prompt("Edit Title", task.title || "");
  if (newTitle === null) return;

  const newDesc = window.prompt("Edit Description", task.description || "");
  if (newDesc === null) return;

  try {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      title: newTitle.trim(),
      description: newDesc.trim(),
      completed: task.completed,
      dueDate: task.dueDate,
    });

    refreshTasks && refreshTasks();
  } catch (err) {
    console.log(err);
  }
};

  // Toggle
  const toggleComplete = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
        ...task,
        completed: !task.completed,
      });

      refreshTasks && refreshTasks(); // ✅
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        All Tasks
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden shadow-sm">
          
          {/* Header */}
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Due Date</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50 transition">
                  
                  <td className="py-3 px-4">{task.title}</td>

                  <td className="py-3 px-4">
                    {task.description || "No description"}
                  </td>

                  <td className="py-3 px-4">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
  onClick={() => toggleComplete(task)}
  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
    task.completed
      ? "bg-green-500 text-white"
      : "bg-yellow-400 text-black"
  }`}
>
  {task.completed ? "✔ Done" : "⏳ Pending"}
</button>
                  </td>

                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}