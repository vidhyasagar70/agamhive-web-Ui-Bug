// src/components/ItemAssignmentForm.tsx

import React, { useEffect, useState } from "react";
import { fetchItemAssignments, createItemAssignment, updateItemAssignment } from "../services/itemAssignedService";
import { fetchItems } from "../services/ItemService"; 
import { getRacks } from "../services/rackService"; 
import { ItemType } from "../types/ItemTypes";
import { Rack } from "../types/rack";
import { Plus, MoreVertical, X } from "lucide-react";
import '../styles/ItemModels.css';
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination"; // Import the Pagination component

const ItemAssignmentForm: React.FC = () => {
    const [items, setItems] = useState<ItemType[]>([]);
    const [racks, setRacks] = useState<Rack[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [selectedRackId, setSelectedRackId] = useState<string>("");
    const [itemAssignments, setItemAssignments] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentAssignmentId, setCurrentAssignmentId] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5; // Set the number of items per page

    useEffect(() => {
        const loadData = async () => {
            setLoading(true); // Set loading to true when starting to load data
            try {
                const itemResponse = await fetchItems();
                const rackResponse = await getRacks(); 
                const assignmentResponse = await fetchItemAssignments();
    
                if (itemResponse.data) {
                    setItems(itemResponse.data.items);
                }
                if (rackResponse.data) {
                    setRacks(rackResponse.data.racks);
                }
                if (assignmentResponse.data) {
                    setItemAssignments(assignmentResponse.data);
                }
            } catch (error) {
                console.error("Error loading data:", error); // Log any errors
            } finally {
                setLoading(false); // Set loading to false after data is loaded
            }
        };
    
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItemId && selectedRackId) {
            if (isEditing) {
                const response = await updateItemAssignment(currentAssignmentId, selectedItemId, selectedRackId);
                if (response.data) {
                    const updatedAssignments = itemAssignments.map(assignment => 
                        assignment._id === currentAssignmentId ? { 
                            ...assignment, 
                            itemId: items.find(item => item._id === selectedItemId), 
                            rackId: racks.find(rack => rack._id === selectedRackId) 
                        } : assignment
                    );
                    setItemAssignments(updatedAssignments);
                }
            } else {
                const response = await createItemAssignment(selectedItemId, selectedRackId);
                if (response.data) {
                    const { itemId, rackId } = response.data.data;
                    const itemDetails = items.find(item => item._id === itemId);
                    const rackDetails = racks.find(rack => rack._id === rackId);
                    const newAssignment = {
                        _id: response.data._id || Math.random().toString(36).substr(2, 9),
                        itemId: itemDetails,
                        rackId: rackDetails,
                        status: "ACTIVE",
                    };
                    setItemAssignments((prev) => [...prev, newAssignment]);
                }
            }
           
            setSelectedItemId("");
            setSelectedRackId("");
            setIsEditing(false);
            setCurrentAssignmentId("");
            setIsModalOpen(false); 
        }
    };

    const handleDelete = async (assignmentId: string) => {
        const response = await updateItemAssignment(assignmentId, "", "", "INACTIVE");
        if (response.data) {
            const updatedAssignments = itemAssignments.map(assignment => 
                assignment._id === assignmentId ? { ...assignment, status: "INACTIVE" } : assignment
            );
            setItemAssignments(updatedAssignments);
        }
    };

    const handleEdit = (assignment: any) => {
        setSelectedItemId(assignment.itemId._id);
        setSelectedRackId(assignment.rackId._id);
        setIsEditing(true);
        setCurrentAssignmentId(assignment._id);
        setIsModalOpen(true); 
    };

    // Filter item assignments based on search term
    const filteredAssignments = itemAssignments.filter(assignment => {
        const itemName = assignment.itemId ? assignment.itemId.partName.toLowerCase() : "";
        const hsnCode = assignment.itemId ? assignment.itemId.hsnCode.toLowerCase() : "";
        const rackName = assignment.rackId ? assignment.rackId.rackName.toLowerCase() : "";
        return (
            itemName.includes(searchTerm.toLowerCase()) ||
            hsnCode.includes(searchTerm.toLowerCase()) ||
            rackName.includes(searchTerm.toLowerCase())
        );
    });

    // Calculate the current items to display based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

    return (
        <div className="item-models-container">
            <h2>Assign Item to Rack</h2>
            <div className="item-models-header">
                <SearchComponent
                    placeholder="Search models..."
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <button className="item-models-add-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Add Item
                </button>
            </div>

            {loading ? ( // Show spinner while loading
                <div className="spinner"></div>
            ) : (
                <>
                    {isModalOpen && (
                        <div className="item-models-modal-overlay">
                            <div className="item-models-modal">
                                <div className="item-models-modal-header">
                                    <h5>{isEditing ? "Edit Assignment" : "Add New Assignment"}</h5>
                                    <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="itemSelect">Select Item:</label>
                                        <select
                                            id="itemSelect"
                                            value={selectedItemId}
                                            onChange={(e) => setSelectedItemId(e.target.value)}
                                        >
                                            <option value="">Select an item</option>
                                            {items.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.partName} (HSN: {item.hsnCode})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="rackSelect">Select Rack:</label>
                                        <select
                                            id="rackSelect"
                                            value={selectedRackId}
                                            onChange={(e) => setSelectedRackId(e.target.value)}
                                        >
                                            <option value="">Select a rack</option>
                                            {racks.map((rack) => (
                                                <option key={rack._id} value={rack._id}>
                                                    {rack.rackName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit">{isEditing ? "Update Item" : "Add Item"}</button>
                                </form>
                            </div>
                        </div>
                    )}

                    <h2>Assigned Items</h2>
                    <table className="item-models-table">
                        <thead>
                            <tr>
                                <th>Item HSN Code</th>
                                <th>Item Name</th>
                                <th>Rack Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((assignment) => (
                                <tr key={assignment._id}>
                                    <td>{assignment.itemId ? assignment.itemId.hsnCode : "N/A"}</td>
                                    <td>{assignment.itemId ? assignment.itemId.partName : "N/A"}</td>
                                    <td>{assignment.rackId ? assignment.rackId.rackName : "N/A"}</td>
                                    <td>{assignment.status}</td>
                                    <td className="item-models-actions">
                                        <button onClick={() => setDropdownOpen((prev) => (prev === assignment._id ? null : assignment._id!))}>
                                            <MoreVertical size={20} />
                                        </button>
                                        {dropdownOpen === assignment._id && (
                                            <div className="item-models-dropdown">
                                                <button onClick={() => handleEdit(assignment)}>Edit</button>
                                                <button className="delete" onClick={() => handleDelete(assignment._id)}>Delete</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Component */}
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={setCurrentPage} 
                    />
                </>
            )}
        </div>
    );
};

export default ItemAssignmentForm;