import { useState } from "react";
import axios from "axios";

export default function TaskForm({ closeModal, refreshTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        {
          title,
          description,
          dueDate,
        }
      );

      alert("Task Added ✅");

      if (refreshTasks) refreshTasks();
      if (closeModal) closeModal();

      setTitle("");
      setDescription("");
      setDueDate("");

    } catch (err) {
      console.error("Add Task Error:", err);
      alert("Error adding task ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
      {/* Title */}
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      />

      {/* Description */}
      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      />

      {/* Due Date */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      />

      {/* Button */}
      <button
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}