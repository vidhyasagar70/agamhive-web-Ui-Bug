import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import {
  getInwardOptions,
  createInwardOption,
  updateInwardOption,
  deleteInwardOption,
  InwardOption,
} from "../services/inwardOptionService";
import "../styles/ItemModels.css"; 
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";

const InwardOptions: React.FC = () => {
  const [options, setOptions] = useState<InwardOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<InwardOption[]>([]);
  const [optionName, setOptionName] = useState("");
  const [status, setStatus] = useState("Active");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOptions();
  }, []);

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch Inward Options
  const fetchOptions = async () => {
    setLoading(true);
    try {
      const data = await getInwardOptions(1, 100); // Fetching larger dataset
      setOptions(data);
      setFilteredOptions(data); // Initially, all options are shown
    } catch (err) {
      setError("Failed to fetch data.");
    }
    setLoading(false);
  };

  // Filter options based on searchTerm
  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
    } else {
      const filteredData = options.filter((option) =>
        option.optionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filteredData);
    }
  }, [searchTerm, options]);

  // Handle Create or Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newData = { optionName, status };
      if (editingId) {
        await updateInwardOption(editingId, newData);
      } else {
        await createInwardOption(newData);
      }
      resetForm();
      fetchOptions();
    } catch (err) {
      setError("Operation failed.");
    }
    setLoading(false);
  };

  // Handle Edit
  const handleEdit = (option: InwardOption) => {
    setOptionName(option.optionName);
    setStatus(option.status);
    setEditingId(option._id || null);
    setShowModal(true);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      setLoading(true);
      try {
        await deleteInwardOption(id);
        fetchOptions();
      } catch (err) {
        setError("Delete failed.");
      }
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setOptionName("");
    setStatus("Active");
    setEditingId(null);
    setShowModal(false);
  };

  // **Pagination logic**
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const paginatedOptions = filteredOptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="item-models-container">
      <h3>Inward Options Management</h3>

      {/* Add Button */}
      <div className="item-models-header">
        <SearchComponent
          placeholder="Search options..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <button className="item-models-add-btn" onClick={() => setShowModal(true)}>
          Add Option
        </button>
      </div>

     
      {error && <p className="error-message">{error}</p>}

      
      {loading && <div className="spinner"></div>}

      
      
        <table className="item-models-table">
          <thead>
            <tr>
              <th>Option Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOptions.length > 0 ? (
              paginatedOptions.map((option) => (
                <tr key={option._id}>
                  <td>{option.optionName}</td>
                  <td>{option.status}</td>
                  <td className="item-models-actions">
                    <button onClick={() => setActionMenu(option._id || null)}>
                      <MoreVertical />
                    </button>

                    {/* Dropdown Menu */}
                    {actionMenu === option._id && (
                      <div className="item-models-dropdown">
                        <button onClick={() => handleEdit(option)}>Edit</button>
                        <button onClick={() => handleDelete(option._id!)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No inward options available.</td>
              </tr>
            )}
          </tbody>
        </table>
      

      <div className="pagination-container">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h4>{editingId ? "Edit Option" : "Add Option"}</h4>
              <button className="item-models-modal-close" onClick={resetForm}>
                ✖
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Option Name"
                value={optionName}
                onChange={(e) => setOptionName(e.target.value)}
                required
              />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button type="submit">{editingId ? "Update" : "Add"} Option</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InwardOptions;
