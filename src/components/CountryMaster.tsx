import React, { useEffect, useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import "../styles/ItemModels.css";
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";
import { ApiResponse, Country, CountryResponse } from "../types/countrytypes";
import { deleteData, getData, patchData, postData } from "../services/ApiServices";

const CountryMaster: React.FC = () => {
  const [countryData, setCountryData] = useState<Country[]>([]);
  const [filteredCountryData, setFilteredCountryData] = useState<Country[]>([]);
  const [newCountry, setNewCountry] = useState<Country>({ countryCode: "", countryName: "", status: "ACTIVE" });
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCountryData.length / itemsPerPage);
  const paginatedData = filteredCountryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 when search term changes
    fetchCountries();
  }, [searchTerm]);

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const response = await getData<ApiResponse<CountryResponse>>("/country-masters", { page: 1, limit: 100, search: searchTerm });
      console.log("Fetched countries:", response);
      setCountryData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filteredData = countryData.filter(
      (u) =>
        u.countryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.countryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountryData(filteredData);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchTerm, countryData]);

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCountry) {
        await patchData<ApiResponse<CountryResponse>>("/country-masters", editingCountry._id!, editingCountry);
      } else {
        await postData<ApiResponse<CountryResponse>>("/country-masters", newCountry);
      }
      fetchCountries();
      setIsModalOpen(false);
      setEditingCountry(null);
      setNewCountry({ countryCode: "", countryName: "", status: "ACTIVE" });
    } catch (error) {
      console.error("Error saving country:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCountry = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this country permanently?")) {
      try {
        await deleteData("/country-masters", id);
        fetchCountries();
      } catch (error) {
        console.error("Error deleting country:", error);
      }
    }
  };

  return (
    <div className="item-models-container">
      <h3>Country Master</h3>
      {error && <p className="text-red-500">{error}</p>}

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
              <Plus size={20} /> Add Country
            </button>
          </div>

          <table className="item-models-table">
            <thead>
              <tr>
                <th>CountryCode</th>
                <th>CountryName</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((u) => (
                <tr key={u._id}>
                  <td>{u.countryCode}</td>
                  <td>{u.countryName}</td>
                  <td>{u.status}</td>
                  <td className="item-models-actions">
                    <MoreVertical size={20} />
                    <div className="item-models-dropdown">
                      <button onClick={() => { setEditingCountry(u); setIsModalOpen(true); }}>Edit</button>
                      <button onClick={() => handleDeleteCountry(u._id!)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {isModalOpen && (
        <div className="item-models-modal-overlay">
          <div className="item-models-modal">
            <div className="item-models-modal-header">
              <h5>{editingCountry ? "Edit Country" : "Add New Country"}</h5>
              <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>✖</button>
            </div>
            <form onSubmit={handleAddOrEdit}>
              <input
                type="text"
                placeholder="Code"
                value={editingCountry ? editingCountry.countryCode : newCountry.countryCode}
                onChange={(e) => editingCountry
                  ? setEditingCountry({ ...editingCountry, countryCode: e.target.value })
                  : setNewCountry({ ...newCountry, countryCode: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={editingCountry ? editingCountry.countryName : newCountry.countryName}
                onChange={(e) => editingCountry
                  ? setEditingCountry({ ...editingCountry, countryName: e.target.value })
                  : setNewCountry({ ...newCountry, countryName: e.target.value })}
                required
              />
              <select
                value={editingCountry ? editingCountry.status : newCountry.status}
                onChange={(e) => editingCountry
                  ? setEditingCountry({ ...editingCountry, status: e.target.value })
                  : setNewCountry({ ...newCountry, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner"></div> : editingCountry ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CountryMaster;
