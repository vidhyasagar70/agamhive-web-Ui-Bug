import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included
import Select, { StylesConfig, OptionProps, GroupBase, ActionMeta, SingleValue } from 'react-select';
import { ItemModel } from "../types/ItemModelTypes";
import { ItemCategory } from "../types/ItemCategoryTypes";
import { UOM } from "../types/uomtypes";
import { ItemType } from "../types/ItemTypes";
import './AddItemModal.new.css'; // New CSS file

interface SelectOption {
  value: string;
  label: string;
}

interface AddItemModalProps {
  show: boolean;
  onClose: () => void;
  onAddItem: (item: ItemType) => Promise<void>;
  itemModels: ItemModel[];
  categories: ItemCategory[];
  uoms: UOM[];
  isProcessing?: boolean;
  isEditing?: boolean;
  handleUpdate?: (item: ItemType) => Promise<void>;
  editingItem?: ItemType;
}





const AddItemModal: React.FC<AddItemModalProps> = ({ show, onClose, onAddItem, itemModels, categories, uoms, isProcessing, isEditing, handleUpdate, editingItem }) => {
  const [newItem, setNewItem] = useState({
    hsnCode: "",
    partName: "",
    internalPartNo: "",
    externalPartNo: "",
    model: "",
    category: "",
    uom: "",
    purchaseItem: false,
    sellingItem: false,
    productionItem: false,
    stockPerDay: 0,
    packingQty: 0,
    safetyDays: 0,
    minReqDay: 0,
    maxReqDays: 0,
    selfLife: 0,
    expiryDays: 0,
    scheduleNo: "",
  });

  useEffect(() => {
    if (isEditing && editingItem) {
      setNewItem({
        ...editingItem,
        model: typeof editingItem.model === "string" ? editingItem.model : editingItem.model._id,
        category: typeof editingItem.category === "string" ? editingItem.category : editingItem.category._id,
        uom: typeof editingItem.uom === "string" ? editingItem.uom : editingItem.uom._id,
      });
      console.log("CURRENT EDITING ITEM IS : ",editingItem);
      console.log("uom option are: ",uomOptions);
      
    }
  }, [isEditing, editingItem]);

  // Convert arrays to react-select options with proper typing
  const modelOptions: SelectOption[] = itemModels.map(model => ({
    value: model._id || '',
    label: model.name
  }));

  const categoryOptions: SelectOption[] = categories.map(category => ({
    value: category._id || '',
    label: category.name
  }));

  const uomOptions: SelectOption[] = uoms.map(uom => ({
    value: uom._id || '',
    label: uom.name
  }));

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: type === "number" ? Number(value) : value === "true" ? true : value === "false" ? false : value,
    }));
  };

  // Handle select changes with proper typing
  const handleSelectChange = (
    newValue: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ): void => {
    const { name } = actionMeta;
    if (name) {
      const fieldName = name as keyof typeof newItem; // Type-safe way
      setNewItem(prev => ({
        ...prev,
        [fieldName]: newValue?.value || ""
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    console.log(newItem);
    e.preventDefault();
    if(isEditing){
      handleUpdate?.(newItem);
      isEditing = false;
    }
    else{
      onAddItem(newItem);
    }  
    onClose();
  };

  // Add this CSS for the toggle switches and buttons
  const handleToggleChange = (name: string) => {
    setNewItem(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  return (
    <div className={`new-modal ${show ? "show" : ""}`}>
      <div className="new-modal-overlay" onClick={onClose}></div>
      <div className="new-modal-container">
        <div className="new-modal-header">
          <h3>{isEditing ? "Edit Item" : "Add New Item"}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="new-modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>HSN Code</label>
                  <input
                    type="text"
                    name="hsnCode"
                    value={newItem.hsnCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Part Name</label>
                  <input
                    type="text"
                    name="partName"
                    value={newItem.partName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Internal Part No</label>
                  <input
                    type="text"
                    name="internalPartNo"
                    value={newItem.internalPartNo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>External Part No</label>
                  <input
                    type="text"
                    name="externalPartNo"
                    value={newItem.externalPartNo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>References</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Model</label>
                  <Select
                    name="model"
                    options={modelOptions}
                    value={modelOptions.find(option => option.value === newItem.model)}
                    onChange={handleSelectChange}
                    placeholder="Select Model"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <Select
                    name="category"
                    options={categoryOptions}
                    value={categoryOptions.find(option => option.value === newItem.category)}
                    onChange={handleSelectChange}
                    placeholder="Select Category"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="form-group">
                  <label>UOM</label>
                  <Select
                    name="uom"
                    options={uomOptions}
                    value={uomOptions.find(option => option.value === newItem.uom)}
                    onChange={handleSelectChange}
                    placeholder="Select UOM"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Item Properties</h4>
              <div className="form-row">
                <div className="form-group toggle-group">
                  <label>Production Item</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="productionItem"
                      name="productionItem"
                      checked={newItem.productionItem}
                      onChange={() => handleToggleChange('productionItem')}
                    />
                    <label htmlFor="productionItem"></label>
                  </div>
                </div>
                <div className="form-group toggle-group">
                  <label>Selling Item</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="sellingItem"
                      name="sellingItem"
                      checked={newItem.sellingItem}
                      onChange={() => handleToggleChange('sellingItem')}
                    />
                    <label htmlFor="sellingItem"></label>
                  </div>
                </div>
                <div className="form-group toggle-group">
                  <label>Purchase Item</label>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="purchaseItem"
                      name="purchaseItem"
                      checked={newItem.purchaseItem}
                      onChange={() => handleToggleChange('purchaseItem')}
                    />
                    <label htmlFor="purchaseItem"></label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Quantities & Timings</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Per Day</label>
                  <input
                    type="number"
                    name="stockPerDay"
                    value={newItem.stockPerDay}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Packing Quantity</label>
                  <input
                    type="number"
                    name="packingQty"
                    value={newItem.packingQty}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Safety Days</label>
                  <input
                    type="number"
                    name="safetyDays"
                    value={newItem.safetyDays}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Min Req</label>
                  <input
                    type="number"
                    name="minReqDay"
                    value={newItem.minReqDay}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Req</label>
                  <input
                    type="number"
                    name="maxReqDays"
                    value={newItem.maxReqDays}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Self Life (days)</label>
                  <input
                    type="number"
                    name="selfLife"
                    value={newItem.selfLife}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Expiry (days)</label>
                  <input
                    type="number"
                    name="expiryDays"
                    value={newItem.expiryDays}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Schedule No</label>
                <input
                  type="text"
                  name="scheduleNo"
                  value={newItem.scheduleNo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        <div className="new-modal-footer">
          <button
            className="btn-secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : isEditing ? "Update Item" : "Add Item"} </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
