import { useState } from "react";
import axios from "axios";

const ImportSheet = ({ refreshTasks }) => {
  const [url, setUrl] = useState("");

  const handleImport = async () => {
    if (!url.trim()) {
      alert("Please enter a Google Sheet link");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks/import`,
        {
          sheetUrl: url,
        }
      );

      alert("Task imported successfully ✅");
      setUrl("");

      if (refreshTasks) refreshTasks();

    } catch (err) {
      console.error("Import Error:", err);
      alert("Error during task import ❌");
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Import from Google Sheets
      </h3>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste Google Sheet link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleImport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Import
        </button>
      </div>
    </div>
  );
};

export default ImportSheet;