import React, { useEffect, useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import "../styles/ItemModels.css";
import { getData, postData, patchData, deleteData } from "../services/ApiServices";
import SearchComponent from "./search/search";
import Pagination from "./pagenation/Pagination";
import { ApiResponse, City, CityResponse } from "../types/citytypes";
import { State, stateResponse } from "../types/statetypes";
import { Country, CountryResponse } from "../types/countrytypes";

const CityMaster: React.FC = () => {
    const [cityData, setCityData] = useState<City[]>([]);
    const [filteredCityData, setFilteredCityData] = useState<City[]>([]);
    const [stateOptions, setStateOptions] = useState<State[]>([]);
    const [countryOptions, setCountryOptions] = useState<Country[]>([]);
    const [newCity, setNewCity] = useState({ cityName: "", stateId: "", countryId: "" });
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchCities();
        fetchStates();
        fetchCountries();
    }, []);

    useEffect(() => {
        filterCities();
    }, [searchTerm, cityData]);

    // Pre-fill form fields when editing
    useEffect(() => {
        if (editingCity) {
            setNewCity({
                cityName: editingCity.cityName,
                stateId: editingCity.stateId?._id || "",
                countryId: editingCity.countryId?._id || "",
            });
        }
    }, [editingCity]);

    const fetchCities = async () => {
        try {
            const response = await getData<ApiResponse<CityResponse>>("/citymasters", { page: 1, limit: 100 });
            console.log("city data: ", response?.data);

            if (response?.data?.data && Array.isArray(response.data.data)) {
                setCityData(response.data.data); // Explicitly setting only the city list
            } else {
                setCityData([]); // Ensure it's an empty array if data is not valid
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchStates = async () => {
        try {
            const response = await getData<ApiResponse<stateResponse>>("/statemaster", { page: 1, limit: 100 });
            console.log("state options: ", response);

            setStateOptions(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await getData<ApiResponse<CountryResponse>>("/country-masters", { page: 1, limit: 100 });
            console.log("country options: ", response);

            setCountryOptions(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    };

    const filterCities = () => {
        if (!searchTerm) {
            setFilteredCityData(cityData);
            return;
        }
        const filteredData = cityData.filter(
            (c) =>
                c.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.stateId?.statName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (c.countryId && c.countryId?.countryName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCityData(filteredData);
        setCurrentPage(1);
    };

    const handleAddOrEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCity) {
                console.log("Updating city:", {
                    cityName: newCity.cityName,
                    stateId: newCity.stateId,
                    countryId: newCity.countryId,
                });

                await patchData(`/citymasters`, editingCity._id, {
                    cityName: newCity.cityName,
                    stateId: newCity.stateId,
                    countryId: newCity.countryId,
                });
            } else {

                console.log("post data:", newCity);

                await postData("/citymasters", newCity);
            }
            fetchCities();
            setIsModalOpen(false);
            setEditingCity(null);
            setNewCity({ cityName: "", stateId: "", countryId: "" });
        } catch (error) {
            console.error("Error saving city:", error);
        }
    };

    const handleDeleteCity = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this city?")) {
            try {
                const response = await deleteData("/citymasters", id);
                console.log(response);

                fetchCities();
            } catch (error) {
                console.error("Error deleting city:", error);
            }
        }
    };

    const totalPages = Math.ceil(filteredCityData.length / itemsPerPage);
    const paginatedData = filteredCityData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="item-models-container">
            <h3>City Master</h3>
            <div className="item-models-header">
                <SearchComponent placeholder="Search cities..." searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <button className="item-models-add-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Add City
                </button>
            </div>

            <table className="item-models-table">
                <thead>
                    <tr>
                        <th>City Name</th>
                        <th>State Name</th>
                        <th>Country Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((c) => (
                        <tr key={c._id}>
                            <td>{c.cityName}</td>
                            <td>{c.stateId.statName}</td>
                            <td>{c.countryId?.countryName || "N/A"}</td>
                            <td className="item-models-actions">
                                <MoreVertical size={20} />
                                <div className="item-models-dropdown">
                                    <button onClick={() => { setEditingCity(c); setIsModalOpen(true); }}>Edit</button>
                                    <button onClick={() => handleDeleteCity(c._id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="item-models-modal-overlay">
                    <div className="item-models-modal">
                        <div className="item-models-modal-header">
                            <h5>{editingCity ? "Edit City" : "Add New City"}</h5>
                            <button className="item-models-modal-close" onClick={() => setIsModalOpen(false)}>✖</button>
                        </div>
                        <form onSubmit={handleAddOrEdit}>
                            <input
                                type="text"
                                placeholder="City Name"
                                value={newCity.cityName}
                                onChange={(e) => setNewCity({ ...newCity, cityName: e.target.value })}
                                required
                            />

                            {/* State Dropdown */}
                            <select
                                value={newCity.stateId}
                                onChange={(e) => setNewCity({ ...newCity, stateId: e.target.value })}
                                required
                            >
                                <option value="">Select State</option> {/* Default option */}
                                {stateOptions.map((state) => (
                                    <option key={state._id} value={state._id}>
                                        {state.statName}
                                    </option>
                                ))}
                            </select>

                            {/* Country Dropdown */}
                            <select
                                value={newCity.countryId}
                                onChange={(e) => setNewCity({ ...newCity, countryId: e.target.value })}
                                required
                            >
                                <option value="">Select Country</option> {/* Default option */}
                                {countryOptions.map((country) => (
                                    <option key={country._id} value={country._id}>
                                        {country.countryName}
                                    </option>
                                ))}
                            </select>

                            <button type="submit">{editingCity ? "Update" : "Add"}</button>
                        </form>

                    </div>
                </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export default CityMaster;
