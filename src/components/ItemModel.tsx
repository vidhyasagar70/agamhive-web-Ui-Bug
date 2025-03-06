import { useEffect, useState } from "react";
import { ItemModel } from "../types/ItemModelTypes";
import {
  createItemModel,
  deleteItemModel,
  fetchItemModelData,
  updateItemModel,
} from "../services/ItemModelService";
import { Plus, MoreVertical, X } from "lucide-react";
import "../styles/ItemModels.css";
import SearchComponent from "./search/search";
import Pagination from "../components/pagenation/Pagination";

const ItemModels: React.FC = () => {
  const [itemModels, setItemModels] = useState<ItemModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<ItemModel[]>([]);
  const [currentModel, setCurrentModel] = useState<ItemModel>({
    code: "",
    name: "",
    status: "ACTIVE",
  });
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); 
    filterData();
  }, [searchTerm, itemModels]);

  useEffect(() => {
    filterData();
  }, [currentPage]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchItemModelData({
        page: 1,
        limit: 100,
        search: searchTerm });
      if (result.data) {
        setItemModels(result.data.items);
        setFilteredModels(result.data.items);
      }
    } catch (err) {
      setError("Failed to load item models");
    }
    setIsLoading(false);
  };

  const filterData = () => {
    let filtered = itemModels;
    if (searchTerm) {
      filtered = itemModels.filter(
        (model) =>
          model.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredModels(filtered);
  };

  const handleAddModel = () => {
    setCurrentModel({ code: "", name: "", status: "ACTIVE" });
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (model: ItemModel) => {
    setCurrentModel(model);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this model?")) {
      try {
        await deleteItemModel(id);
        loadData();
      } catch (err) {
        setError("Failed to delete item model");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editMode) {
        await updateItemModel(currentModel._id as string, currentModel);
      } else {
        await createItemModel(currentModel);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError("Failed to save item model");
    }
    setIsLoading(false);
  };

  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="item-models-container">
      <h3>Item Models</h3>

      <div className="item-models-header">
        <SearchComponent
          placeholder="Search models..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <button className="item-models-add-btn" onClick={handleAddModel}>
          <Plus size={20} /> Add Model
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="spinner"></div>
       
      ) : paginatedModels.length === 0 ? (
        <p>No models found.</p>
      ) : (
        <>
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
              {paginatedModels.map((model) => (
                <tr key={model._id}>
                  <td>{model.code}</td>
                  <td>{model.name}</td>
                  <td>{model.status}</td>
                  <td className="item-models-actions">
                    <button
                      onClick={() =>
                        setDropdownOpen((prev) => (prev === model._id ? null : model._id!))
                      }
                    >
                      <MoreVertical size={20} />
                    </button>

                    {dropdownOpen === model._id && (
                      <div className="item-models-dropdown">
                        <button onClick={() => handleEdit(model)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(model._id!)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredModels.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h5>{editMode ? "Edit Model" : "Add New Model"}</h5>
              <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Code"
                value={currentModel.code}
                onChange={(e) => setCurrentModel({ ...currentModel, code: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={currentModel.name}
                onChange={(e) => setCurrentModel({ ...currentModel, name: e.target.value })}
                required
              />
              <select
                value={currentModel.status}
                onChange={(e) => setCurrentModel({ ...currentModel, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="DEACTIVE">Deactive</option>
              </select>
              <button type="submit">{editMode ? "Update" : "Add"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemModels;
