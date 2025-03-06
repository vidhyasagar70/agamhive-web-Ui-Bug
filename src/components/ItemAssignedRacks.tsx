import React, { useEffect, useState } from "react";
import { MoreVertical, X } from "lucide-react"; // Imported X icon for closing the modal
import {
  getItemAssignedRacks,
  createItemAssignedRack,
  updateItemAssignedRack,
  deleteItemAssignedRack,
  ItemAssignedRack,
} from "../services/itemAssignedRacksService";
import "../styles/ItemModels.css";
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";

const ItemAssignedRackComponent: React.FC = () => {
  const [racks, setRacks] = useState<ItemAssignedRack[]>([]);
  const [optionName, setOptionName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [editingRack, setEditingRack] = useState<ItemAssignedRack | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    try {
      const data = await getItemAssignedRacks();
      setRacks(data);
    } catch (error) {
      console.error("Error fetching item assigned racks:", error);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingRack) {
        await updateItemAssignedRack(editingRack.id!, { optionName, status });
      } else {
        await createItemAssignedRack({ optionName, status });
      }
      resetForm();
      fetchRacks();
    } catch (error) {
      console.error("Error saving item assigned rack:", error);
    }
  };

  const handleEdit = (rack: ItemAssignedRack) => {
    setEditingRack(rack);
    setOptionName(rack.optionName);
    setStatus(rack.status);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item assigned rack permanently?")) {
      try {
        await deleteItemAssignedRack(id);
        fetchRacks();
      } catch (error) {
        console.error("Error deleting item assigned rack:", error);
      }
    }
  };

  const resetForm = () => {
    setOptionName("");
    setStatus("ACTIVE");
    setEditingRack(null);
    setShowModal(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredRacks = racks.filter((rack) =>
    rack.optionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRacks.length / itemsPerPage);
  const paginatedRacks = filteredRacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="item-models-container">
      <h3>Item Assigned Racks Management</h3>
      <div className="item-models-header">
        <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <button className="item-models-add-btn" onClick={() => setShowModal(true)}>
          Add Item Assigned
        </button>
      </div>
      <table className="item-models-table">
        <thead>
          <tr>
            <th>Option Name</th>
            <th>Status</th>
            <th className="item-models-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRacks.map((rack) => (
            <tr key={rack.id}>
              <td>{rack.optionName}</td>
              <td>{rack.status}</td>
              <td className="item-models-actions">
                <button onClick={() => setActionMenu(rack.id !== undefined ? rack.id : null)}>
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
      
      {showModal && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h3>{editingRack ? "Edit Item Assigned Rack" : "Add Item Assigned Rack"}</h3>
              <button className="item-models-modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <input type="text" placeholder="Enter Option Name" value={optionName} onChange={(e) => setOptionName(e.target.value)} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <button onClick={handleCreateOrUpdate}>{editingRack ? "Update" : "Add"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemAssignedRackComponent;
