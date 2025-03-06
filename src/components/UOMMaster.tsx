import React, { useEffect, useState } from "react";
import { fetchUomData, createUom, updateUom, deleteUom } from "../services/uomService";
import { UOM } from "../types/uomtypes";
import { Plus, MoreVertical } from "lucide-react";
import "../styles/ItemModels.css"; 
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";

const UOMMaster: React.FC = () => {
  const [uomData, setUomData] = useState<UOM[]>([]);
  const [filteredUomData, setFilteredUomData] = useState<UOM[]>([]);
  const [newUom, setNewUom] = useState<UOM>({ code: "", name: "", status: "ACTIVE" });
  const [editingUom, setEditingUom] = useState<UOM | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
   const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 5; 
  const totalPages = Math.ceil(filteredUomData.length / itemsPerPage);

  const paginatedData = filteredUomData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const loadUoms = async () => {
      setIsLoading(true); // Show spinner
      const result = await fetchUomData({
        page: 1,
        limit: 100,
        search: searchTerm 
      });

      if (result.error) {
        setError(result.error);
      } else if (Array.isArray(result.data?.items)) {
        setUomData(result.data?.items ?? []); 
        setFilteredUomData(result.data?.items ?? []); 
      } else {
        setUomData([]);
        setFilteredUomData([]);
      }
      setIsLoading(false); // Hide spinner
    };

    loadUoms();
  }, [reloadFlag]);

  useEffect(() => {
    const filteredData = uomData.filter(
      (u) =>
        u.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUomData(filteredData);
  }, [searchTerm, uomData]);

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = editingUom 
      ? await updateUom(editingUom._id!, editingUom) 
      : await createUom(newUom);

    if (result.error) {
      setError(result.error);
    } else {
      setIsModalOpen(false);
      setEditingUom(null);
      setNewUom({ code: "", name: "", status: "ACTIVE" });
      setReloadFlag((prev) => !prev);
    }

    setIsLoading(false);
  };

  const handleDeleteUom = async (id: string) => {
    setIsLoading(true);
    const result = await deleteUom(id);
    if (!result.error) {
      setReloadFlag((prev) => !prev);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="item-models-container">
      <h3>UOM Master</h3>
      {error && <p className="text-red-500">{error}</p>}

      {/* Show spinner when loading */}
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="item-models-header">
            <SearchComponent
              placeholder="Search models..."
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <button className="item-models-add-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> Add UOM
            </button>
          </div>

          <table className="item-models-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((u) => (
                <tr key={u._id}>
                  <td>{u.code}</td>
                  <td>{u.name}</td>
                  <td>{u.status}</td>
                  <td className="item-models-actions">
                    <MoreVertical size={20} />
                    <div className="item-models-dropdown">
                      <button onClick={() => { setEditingUom(u); setIsModalOpen(true); }}>Edit</button>
                      <button onClick={() => handleDeleteUom(u._id!)}>Delete</button>
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
              <h5>{editingUom ? "Edit UOM" : "Add New UOM"}</h5>
              <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>✖</button>
            </div>
            <form onSubmit={handleAddOrEdit}>
              <input
                type="text"
                placeholder="Code"
                value={editingUom ? editingUom.code : newUom.code}
                onChange={(e) => editingUom 
                  ? setEditingUom({ ...editingUom, code: e.target.value }) 
                  : setNewUom({ ...newUom, code: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={editingUom ? editingUom.name : newUom.name}
                onChange={(e) => editingUom 
                  ? setEditingUom({ ...editingUom, name: e.target.value }) 
                  : setNewUom({ ...newUom, name: e.target.value })}
                required
              />
              <select
                value={editingUom ? editingUom.status : newUom.status}
                onChange={(e) => editingUom 
                  ? setEditingUom({ ...editingUom, status: e.target.value }) 
                  : setNewUom({ ...newUom, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="DEACTIVE">Deactive</option>
              </select>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingUom ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UOMMaster;
