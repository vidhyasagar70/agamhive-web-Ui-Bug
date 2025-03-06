import { useEffect, useState } from "react";
import { ItemCategory } from "../types/ItemCategoryTypes";
import {
  createItemCategory,
  deleteItemCategory,
  fetchItemCategoryData,
  updateItemCategory,
} from "../services/ItemCategoryService";
import { Plus, MoreVertical, X } from "lucide-react";
import "../styles/ItemModels.css";
import SearchComponent from "./search/search";
import Pagination from "../components/pagenation/Pagination";

const ItemCategories: React.FC = () => {
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ItemCategory>({
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
  const itemsPerPage = 7;

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search term changes
    loadData();
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await fetchItemCategoryData({
        page: 1,
        limit: 100,
        search: searchTerm });
      if (result.data) {
        setItemCategories(result.data.items);
      }
    } catch (err) {
      setError("Failed to load categories");
    }
    setIsLoading(false);
  };

  const handleAddCategory = () => {
    setCurrentCategory({ code: "", name: "", status: "ACTIVE" });
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (category: ItemCategory) => {
    setCurrentCategory(category);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteItemCategory(id);
        loadData();
      } catch (err) {
        setError("Failed to delete category");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editMode) {
        await updateItemCategory(currentCategory._id as string, currentCategory);
      } else {
        await createItemCategory(currentCategory);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError("Failed to save category");
    }
    setIsLoading(false);
  };

  const paginatedCategories = itemCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="item-models-container">
      <h3>Item Categories</h3>

      <div className="item-models-header">
        <div>
          <SearchComponent
            placeholder="Search categories..."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <button className="item-models-add-btn" onClick={handleAddCategory}>
          <Plus size={20} /> Add Category
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="spinner"></div>
      ) : paginatedCategories.length === 0 ? (
        <p>No categories found.</p>
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
              {paginatedCategories.map((category) => (
                <tr key={category._id}>
                  <td>{category.code}</td>
                  <td>{category.name}</td>
                  <td>{category.status}</td>
                  <td className="item-models-actions">
                    <button onClick={() => setDropdownOpen((prev) => (prev === category._id ? null : category._id!))}>
                      <MoreVertical size={20} />
                    </button>

                    {dropdownOpen === category._id && (
                      <div className="item-models-dropdown">
                        <button onClick={() => handleEdit(category)}>Edit</button>
                        <button onClick={() => handleDelete(category._id!)}>Delete</button>
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
              totalPages={Math.ceil(itemCategories.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h5>{editMode ? "Edit Category" : "Add New Category"}</h5>
              <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Code"
                value={currentCategory.code}
                onChange={(e) => setCurrentCategory({ ...currentCategory, code: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                required
              />
              <select
                value={currentCategory.status}
                onChange={(e) => setCurrentCategory({ ...currentCategory, status: e.target.value })}
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

export default ItemCategories;
