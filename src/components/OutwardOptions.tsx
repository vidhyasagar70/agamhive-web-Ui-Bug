import React, { useEffect, useState } from "react";
import { MoreVertical, X, Plus } from "lucide-react";
import { 
  fetchOutwardOptions, 
  createOutwardOption, 
  updateOutwardOption, 
  deleteOutwardOption 
} from "../services/outwardOptionsService";
import "../styles/ItemModels.css"; 
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";

interface OutwardOption {
  _id: string;
  optionName: string;
  status: string;
}

const OutwardOptions: React.FC = () => {
  const [options, setOptions] = useState<OutwardOption[]>([]);
  const [newOption, setNewOption] = useState({ optionName: "", status: "ACTIVE" });
  const [editingOption, setEditingOption] = useState<OutwardOption | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const itemsPerPage = 5;

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadOptions = async () => {
    try {
      setLoading(true); // Show spinner
      const response = await fetchOutwardOptions({ page: 1, limit: 100, search: searchTerm });
      console.log("API Response:", response);
      setOptions(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching outward options:", error);
      setOptions([]);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true); // Show spinner
      if (editingOption) {
        const updated = await updateOutwardOption(editingOption._id, newOption);
        if (updated) {
          setOptions(options.map(opt => opt._id === updated._id ? updated : opt));
          setEditingOption(null);
        }
      } else {
        const createdOption = await createOutwardOption(newOption);
        if (createdOption) {
          setOptions([...options, createdOption]);
        }
      }
      setNewOption({ optionName: "", status: "ACTIVE" });
      setShowForm(false);
      loadOptions();
    } catch (error) {
      console.error("Error creating or updating outward option:", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true); // Show spinner
      const success = await deleteOutwardOption(id);
      if (success) {
        setOptions(options.filter(opt => opt._id !== id));
        setSelectedOption(null);
        loadOptions();
      }
    } catch (error) {
      console.error("Error deleting outward option:", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };
  const handleEdit = (option: OutwardOption) => {
    setEditingOption(option);
    setNewOption({ optionName: option.optionName, status: option.status });
    setSelectedOption(null);
    setShowForm(true);
  };
  

  const filteredOptions = options.filter(option => 
    option.optionName && option.optionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const paginatedOptions = filteredOptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="item-models-container">
      <h3>Outward Options</h3>
      <div className="item-models-header">
        <SearchComponent
          placeholder="Search options..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <button className="item-models-add-btn" onClick={() => setShowForm(true)}>
          <Plus size={20} /> Add Option
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div> // Show spinner when loading
      ) : (
        <>
          <table className="item-models-table">
            <thead>
              <tr>
                <th>Option Name</th>
                <th>Status</th>
                <th className="item-models-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOptions.length > 0 ? (
                paginatedOptions.map(option => (
                  <tr key={option._id}>
                    <td>{option.optionName || "Unnamed Option"}</td> 
                    <td>{option.status}</td>
                    <td className="item-models-actions">
                      <MoreVertical onClick={() => setSelectedOption(option._id)} />
                      {selectedOption === option._id && (
                        <div className="item-models-dropdown">
                          <button onClick={() => handleEdit(option)}>Edit</button>
                          <button onClick={() => handleDelete(option._id)}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No outward options available.</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {showForm && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h5>{editingOption ? "Edit Option" : "Add New Option"}</h5>
              <button className="item-models-modal-close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Option Name"
                value={newOption.optionName}
                onChange={(e) => setNewOption({ ...newOption, optionName: e.target.value })}
                required
              />
              <select
                value={newOption.status}
                onChange={(e) => setNewOption({ ...newOption, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <button type="submit" disabled={loading}>
                {loading ? <div className="spinner"></div> : editingOption ? "Update" : "Add"} Option
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutwardOptions;
