import React, { useEffect, useState } from "react";
import { createItem, deleteItem, fetchItems, updateItem } from "../services/ItemService";
import { ItemType } from "../types/ItemTypes";
import { fetchItemModelData } from "../services/ItemModelService";
import { fetchItemCategoryData } from "../services/ItemCategoryService";
import { fetchUomData } from "../services/uomService";
import { ItemModel } from "../types/ItemModelTypes";
import { ItemCategory } from "../types/ItemCategoryTypes";
import { UOM } from "../types/uomtypes";
import styled from 'styled-components';
import AddItemModal from "./AddItemModal";
import { Trash2, Pencil, Plus, Search } from "lucide-react";
import LoadingSpinner from "./common/LoadingSpinner";
import { Container, Header, Title, ActionContainer, SearchBox, AddButton, ErrorMessage, TableContainer } from "./StyledComponents";
import { PageItem } from "react-bootstrap";
import "../styles/ItemModels.css";
import { MoreVertical, X } from "lucide-react";
import SearchComponent from "./search/search";
import Pagination from "../components/pagenation/Pagination"; 



const ItemList: React.FC = () => {
    const [items, setItems] = useState<ItemType[]>([]);
    const [newItem, setNewItem] = useState<ItemType>({
        hsnCode: "",
        internalPartNo: "",
        externalPartNo: "",
        partName: "",
        model: "",
        category: "",
        uom: "",
        packingQty: 0,
        stockPerDay: 0,
        safetyDays: 0,
        minReqDay: 0,
        maxReqDays: 0,
        productionItem: false,
        sellingItem: false,
        purchaseItem: false,
        selfLife: 0,
        expiryDays: 0,
        scheduleNo: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ItemType | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reloadFlag, setReloadFlag] = useState(false);
    const [itemModels, setItemModels] = useState<ItemModel[]>([]);
    const [categories, setCategories] = useState<ItemCategory[]>([]);
    const [uoms, setUoms] = useState<UOM[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, 
        setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

    const itemsPerPage = 5;

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [modelResult, categoryResult, uomResult] = await Promise.all([
                    fetchItemModelData({
                        page: 1,
                        limit: 100
                    }),
                    fetchItemCategoryData({
                        page: 1,
                        limit: 100
                    }),
                    fetchUomData({
                        page: 1,
                        limit: 100
                    }),
                ]);

                if (!modelResult.error && modelResult.data) {
                    setItemModels(modelResult.data.items);
                }

                if (!categoryResult.error && categoryResult.data) {
                    setCategories(categoryResult.data.items);
                }

                console.log(uomResult);

                if (!uomResult.error && uomResult.data) {
                    setUoms(uomResult.data?.items);
                }
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };
        loadDropdownData();
    }, []);


    useEffect(() => {
        loadItems();
    }, [searchTerm]);

    const loadItems = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await fetchItems({
                page: currentPage,
                limit,
                search: searchTerm
            });

            console.log(result);

            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                setItems(result.data.items);
                setTotalPages(result.data.totalPages);
            }
        } catch (err) {
            setError('Failed to load items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async (newItem: ItemType) => {
        setIsProcessing(true);
        try {
            const { status, ...itemWithoutStatus } = newItem;
            const result = await createItem(itemWithoutStatus);

            if (result.error) {
                setError(result.error);
            } else {
                setIsModalOpen(false);
                loadItems();
            }
        } catch (err) {
            setError('Failed to create item');
        }
        setIsProcessing(false);
    };

    const handleEditItem = async (editingItem: ItemType) => {
        console.log(editingItem)
        if (!editingItem?._id) {
            alert("Item ID is missing!");
            return;
        }

        const updatedItem: ItemType = {
            ...editingItem,
            model: typeof editingItem.model === "object" ? editingItem.model._id : editingItem.model,
            category: typeof editingItem.category === "object" ? editingItem.category._id : editingItem.category,
            uom: typeof editingItem.uom === "object" ? editingItem.uom._id : editingItem.uom,
        };

        setIsUpdating(true);
        const result = await updateItem(editingItem._id, updatedItem);
        console.log("before sending data to method: ", editingItem)
        if (result.error) {
            setError(result.error);
        } else {
            setEditingItem(null);
            setReloadFlag((prev) => !prev);
            loadItems();
        }
        setIsUpdating(false);
    };

    const handleDeleteItem = async (id: string) => {
        setDeletingId(id);
        const result = await deleteItem(id);
        if (!result.error) {
            setReloadFlag((prev) => !prev);
        } else {
            setError(result.error);
        }
        setDeletingId(null);
        loadItems();
    };

    const handleEditButton = (item: ItemType) => {
        setIsEditing(true)
        setEditingItem(item)
        setIsModalOpen(true)
    }

     
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    return (
        <div className="item-models-container"> 
          <h3>Items List</h3>
      
          <div className="item-models-header">
            <div>
              <SearchComponent
                placeholder="Search items..."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            <button className="item-models-add-btn" onClick={() => { setIsModalOpen(true); setIsEditing(false); }}>
              <Plus size={20} /> Add Item
            </button>
          </div>
      
          {error && <div className="error-message">{error}</div>}
      
          {isLoading ? (
       <div className="spinner"></div>
      ) : paginatedItems.length === 0 ? (
        <p>No Items found.</p>
      ) : (
            <>
              <table className="item-models-table">
                <thead>
                  <tr>
                    <th>HSN Code</th>
                    <th>Part Name</th>
                    <th>Internal Part No</th>
                    <th>External Part No</th>
                    <th>Model</th>
                    <th>Category</th>
                    <th>UOM</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {paginatedItems.map((item) => (
                    <tr key={item._id}>
                      <td>{item.hsnCode}</td>
                      <td>{item.partName}</td>
                      <td>{item.internalPartNo}</td>
                      <td>{item.externalPartNo}</td>
                      <td>{typeof item.model === 'object' ? item.model?.name : 'N/A'}</td>
                      <td>{typeof item.category === 'object' ? item.category?.name : 'N/A'}</td>
                      <td>{typeof item.uom === 'object' ? item.uom?.name : 'N/A'}</td>
                      <td className="item-models-actions">
                        <button onClick={() => setDropdownOpen((prev) => (prev === item._id ? null : item._id!))}>
                          <MoreVertical size={20} />
                        </button>
      
                        {dropdownOpen === item._id && (
                          <div className="item-models-dropdown">
                            <button onClick={() => handleEditButton(item)}>Edit</button>
                            <button onClick={() => handleDeleteItem(item._id!)}>Delete</button>
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
              totalPages={Math.ceil(items.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
            </>
          )}
      
          {isModalOpen && (
            <div className="item-models-modal-overlay">
              <div className="item-models-modal">
                <div className="item-models-modal-header">
                  <h5>{isEditing ? "Edit Item" : "Add New Item"}</h5>
                  <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <AddItemModal
                  show={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onAddItem={handleAddItem}
                  itemModels={itemModels}
                  categories={categories}
                  uoms={uoms}
                  isProcessing={isProcessing}
                  isEditing={isEditing}
                  {...(editingItem && { editingItem, handleUpdate: handleEditItem })}
                />
              </div>
            </div>
          )}
        </div>
      );
      
};

export default ItemList;


