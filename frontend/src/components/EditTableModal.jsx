import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

import { BASE_URL } from "../constants/baseUrl";

const EditTableModal = ({
  isOpen,
  table,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    tableName: "",
    seatCapacity: "",
  });

  const [loading, setLoading] = useState(false);

  // Populate form whenever selected table changes
  useEffect(() => {
    if (table) {
      setFormData({
        tableName: table.name || "",
        seatCapacity: table.seats || "",
      });
    }
  }, [table]);

  if (!isOpen || !table) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tableName.trim()) {
      alert("Table name is required.");
      return;
    }

    if (
      !formData.seatCapacity ||
      Number(formData.seatCapacity) <= 0
    ) {
      alert("Seat capacity must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
        return;
      }

      const payload = {
        tableName: formData.tableName.trim(),
        seatCapacity: Number(formData.seatCapacity),
      };

      const response = await axios.patch(
        `${BASE_URL}/table/v1/update/${table.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      // Refresh tables in Home
      onUpdate();

      onClose();

    } catch (error) {
      console.error("Error updating table:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update table. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Edit Table
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update table information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* Table Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Table Name
            </label>

            <input
              type="text"
              name="tableName"
              value={formData.tableName}
              onChange={handleChange}
              placeholder="Example: Twin Table"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:bg-slate-100"
            />
          </div>

          {/* Seat Capacity */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Seat Capacity
            </label>

            <input
              type="number"
              name="seatCapacity"
              value={formData.seatCapacity}
              onChange={handleChange}
              min="1"
              placeholder="Example: 4"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 disabled:bg-slate-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-300 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-teal-800 py-3 font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Table"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditTableModal;

