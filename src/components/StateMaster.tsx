import React, { useEffect, useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import "../styles/ItemModels.css"; 
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";
import { ApiResponse } from "../types/countrytypes"; 
import { deleteData, getData, patchData, postData } from "../services/ApiServices";
import { State, stateResponse } from "../types/statetypes";

const StateMaster: React.FC = () => {
  const [stateData, setStateData] = useState<State[]>([]);
  const [filteredStateData, setFilteredStateData] = useState<State[]>([]);
  const [newState, setNewState] = useState<State>({ gstCode: "", statName: "", status: "ACTIVE" });
  const [editingState, setEditingState] = useState<State | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    filterStates();
  }, [searchTerm, stateData]);

  const fetchStates = async () => {
    setIsLoading(true);
    try {
      const response = await getData<ApiResponse<stateResponse>>("/statemaster", {
        page: 1,
        limit: 100,
      });
      console.log("Fetched states:", response);
      setStateData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching states:", error);
      setError("Failed to fetch states.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterStates = () => {
    if (!searchTerm) {
      setFilteredStateData(stateData);
      return;
    }
    const filteredData = stateData.filter(
      (s) =>
        s.gstCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.statName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStateData(filteredData);
    setCurrentPage(1);
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingState) {
        await patchData<ApiResponse<State>>("/statemaster", editingState._id!, editingState);
      } else {
        await postData<ApiResponse<stateResponse>>("/statemaster", newState);
      }
      fetchStates();
      setIsModalOpen(false);
      setEditingState(null);
      setNewState({ gstCode: "", statName: "", status: "ACTIVE" });
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving state:", error);
      setError("Error saving state.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteState = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this state permanently?")) {
      try {
        await deleteData("/statemaster", id);
        fetchStates();
      } catch (error) {
        console.error("Error deleting state:", error);
      }
    }
  };

  const totalPages = Math.ceil(filteredStateData.length / itemsPerPage);
  const paginatedData = filteredStateData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="item-models-container">
      <h3>State Master</h3>
      {error && <p className="text-red-500">{error}</p>}

      <div className="item-models-header">
        <SearchComponent
          placeholder="Search states..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <button className="item-models-add-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Add State
        </button>
      </div>

      {/* Loading Spinner */}
      {isLoading && <div className="spinner"></div>}

      {!isLoading && (
        <>
          <table className="item-models-table">
            <thead>
              <tr>
                <th>GST Code</th>
                <th>State Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((s) => (
                <tr key={s._id}>
                  <td>{s.gstCode}</td>
                  <td>{s.statName}</td>
                  <td>{s.status}</td>
                  <td className="item-models-actions">
                    <MoreVertical size={20} />
                    <div className="item-models-dropdown">
                      <button onClick={() => { setEditingState(s); setIsModalOpen(true); }}>Edit</button>
                      <button onClick={() => handleDeleteState(s._id!)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {isModalOpen && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h5>{editingState ? "Edit State" : "Add New State"}</h5>
              <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>✖</button>
            </div>
            <form onSubmit={handleAddOrEdit}>
              <input
                type="text"
                placeholder="GST Code"
                value={editingState ? editingState.gstCode : newState.gstCode}
                onChange={(e) => editingState
                  ? setEditingState({ ...editingState, gstCode: e.target.value })
                  : setNewState({ ...newState, gstCode: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="State Name"
                value={editingState ? editingState.statName : newState.statName}
                onChange={(e) => editingState
                  ? setEditingState({ ...editingState, statName: e.target.value })
                  : setNewState({ ...newState, statName: e.target.value })}
                required
              />
              <select
                value={editingState ? editingState.status : newState.status}
                onChange={(e) => editingState
                  ? setEditingState({ ...editingState, status: e.target.value })
                  : setNewState({ ...newState, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">InACTIVE</option>
              </select>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingState ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateMaster;
