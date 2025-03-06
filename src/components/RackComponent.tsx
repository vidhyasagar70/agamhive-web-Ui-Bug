import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  getRacks,
  createRack,
  updateRack,
  deleteRack,
} from "../services/rackService";
import "../styles/ItemModels.css";
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";
import { Rack } from "../types/rack";

const RackComponent: React.FC = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [rackName, setRackName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    setLoading(true);
    try {
      const response = await getRacks({ page: 1, limit: 100, search: "Storage" });
      setRacks(response.data?.racks || []);
    } catch (error) {
      console.error("Error fetching racks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    try {
      if (editingRack) {
        await updateRack(editingRack.id!, { rackName, status });
      } else {
        await createRack({ rackName, status });
      }
      resetForm();
      await fetchRacks();
    } catch (error) {
      console.error("Error saving rack:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rack: Rack) => {
    setEditingRack(rack);
    setRackName(rack.rackName);
    setStatus(rack.status);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this rack permanently?")) {
      setLoading(true);
      try {
        await deleteRack(id);
        fetchRacks();
      } catch (error) {
        console.error("Error deleting rack:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setRackName("");
    setStatus("ACTIVE");
    setEditingRack(null);
    setShowModal(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredRacks = racks.filter((rack) =>
    rack.rackName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRacks.length / itemsPerPage);
  const paginatedRacks = filteredRacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="item-models-container">
      <h3>Racks Management</h3>
      {loading && <div className="spinner"></div>}
      <div className="item-models-header">
        <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button className="item-models-add-btn" onClick={() => setShowModal(true)}>
          Add Rack
        </button>
      </div>
      {!loading && (
        <>
          <table className="item-models-table">
            <thead>
              <tr>
                <th>Rack Name</th>
                <th>Status</th>
                <th className="item-models-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRacks.map((rack) => (
                <tr key={rack.id}>
                  <td>{rack.rackName}</td>
                  <td>{rack.status}</td>
                  <td className="item-models-actions">
                    <button onClick={() => setActionMenu(rack.id || null)}>
                      <MoreVertical />
                    </button>
                    {actionMenu === rack.id && (
                      <div className="item-models-dropdown">
                        <button onClick={() => handleEdit(rack)}>Edit</button>
                        <button onClick={() => handleDelete(rack.id!)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
      {showModal && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h3>{editingRack ? "Edit Rack" : "Add Rack"}</h3>
              <button className="item-models-modal-close" onClick={resetForm}>
                ✖
              </button>
            </div>
            <form>
              <input
                type="text"
                placeholder="Enter Rack Name"
                value={rackName}
                onChange={(e) => setRackName(e.target.value)}
              />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <button type="button" onClick={handleCreateOrUpdate}>
                {editingRack ? "Update Rack" : "Add Rack"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RackComponent;
