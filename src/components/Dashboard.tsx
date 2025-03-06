import React, { useState, useEffect } from "react";
import { LayoutDashboard, Package, Users, Settings, ChevronDown } from "lucide-react"; 
import "../styles/dashboard.css"; 
import UOMMaster from "../components/UOMMaster"; 
import ItemCategory from "./ItemCategory";
import OutwardOptions from "./OutwardOptions";
import ItemModels from "./ItemModel";
import ItemList from "./ItemList";
import GifDisplay from "./GifDisplay";
import DashboardContent from "./DashboardContent";
import RackComponent from "./RackComponent";
import ItemAssignmentForm from "./ItemAssignmentForm";
import InwardOptionComponent from "./InwardOptionComponent";
import CountryMaster from "./CountryMaster";
import StateMaster from "./StateMaster";
import CityMaster from "./CityMaster";
// import CurrencyMaster from "./CurrencyMaster";

interface OpenMenus {
  MasterItem: boolean;
  Contributor: boolean;
  General: boolean;
}

const Dashboard: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<OpenMenus>({
    MasterItem: false,
    Contributor: false,
    General: false,
  });

  // Retrieve active page from localStorage or default to "dashboard"
  const [activePage, setActivePage] = useState<string>(() => {
    return localStorage.getItem("activePage") || "dashboard";
  });

  const [showInventoryContent, setShowInventoryContent] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  const toggleMenu = (menu: keyof OpenMenus) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const toggleInventoryContent = () => {
    setShowInventoryContent((prev) => !prev);
    setActivePage("dashboard");
  };

  const handleSubItemClick = (page: string) => {
    setActivePage(page);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="dashboard-heading" onClick={toggleInventoryContent}>
              <LayoutDashboard className="menu-icon" />
              Dashboard
            </li>

            <li className="submenu">
              <span className="menu-label" onClick={() => toggleMenu("MasterItem")}>
                <Package className="menu-icon" />
                Master Item
                <ChevronDown className={`dropdown-icon ${openMenus.MasterItem ? "rotate-180" : ""}`} />
              </span>
              {openMenus.MasterItem && (
                <ul className="submenu-list open">
                  <li onClick={() => handleSubItemClick("newItem")}>Item</li>
                  <li onClick={() => handleSubItemClick("itemCategory")}>Item Category</li>
                  <li onClick={() => handleSubItemClick("itemModel")}>Item Model</li>
                  <li onClick={() => handleSubItemClick("inwardOption")}>Inward Option</li>
                  <li onClick={() => handleSubItemClick("outwardOption")}>Outward Option</li>
                  <li onClick={() => handleSubItemClick("newRack")}>New Rack</li>
                  <li onClick={() => handleSubItemClick("itemAssignedRack")}>Item Assigned Rack</li>
                </ul>
              )}
            </li>

            <li className="submenu">
              <span className="menu-label" onClick={() => toggleMenu("Contributor")}>
                <Users className="menu-icon" />
                Contributor
                <ChevronDown className={`dropdown-icon ${openMenus.Contributor ? "rotate-180" : ""}`} />
              </span>
              {openMenus.Contributor && (
                <ul className="submenu-list open">
                  <li onClick={() => handleSubItemClick("newContributor")}>New Contributor</li>
                  <li onClick={() => handleSubItemClick("customerParts")}>Customer Parts</li>
                  <li onClick={() => handleSubItemClick("supplierParts")}>Supplier Parts</li>
                  <li onClick={() => handleSubItemClick("deliveryPlace")}>Delivery Place</li>
                </ul>
              )}
            </li>

            <li className="submenu">
              <span className="menu-label" onClick={() => toggleMenu("General")}>
                <Settings className="menu-icon" />
                General
                <ChevronDown className={`dropdown-icon ${openMenus.General ? "rotate-180" : ""}`} />
              </span>
              {openMenus.General && (
                <ul className="submenu-list open">
                  <li onClick={() => handleSubItemClick("cityMaster")}>City Master</li>
                  <li onClick={() => handleSubItemClick("stateMaster")}>State Master</li>
                  <li onClick={() => handleSubItemClick("countryMaster")}>Country Master</li>
                  <li onClick={() => handleSubItemClick("currencyMaster")}>Currency Master</li>
                  <li onClick={() => handleSubItemClick("gstSlabMaster")}>GST Slab Master</li>
                  <li onClick={() => handleSubItemClick("uomMaster")}>UOM Master</li>
                  <li onClick={() => handleSubItemClick("approvalRole")}>Approval Role</li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        {activePage === "dashboard" && <DashboardContent />}
        {activePage === "uomMaster" && <UOMMaster />}
        {activePage === "itemCategory" && <ItemCategory />}
        {activePage === "itemModel" && <ItemModels />}
        {activePage === "newItem" && <ItemList />}
        {activePage === "newRack" && <RackComponent />}
        {activePage === "inwardOption" && <InwardOptionComponent />}
        {activePage === "outwardOption" && <OutwardOptions />}
        {activePage === "itemAssignedRack" && <ItemAssignmentForm />}
        {activePage === "newContributor" && <GifDisplay />}
        {activePage === "deliveryPlace" && <GifDisplay />}
        {activePage === "supplierParts" && <GifDisplay />}
        {activePage === "customerParts" && <GifDisplay />}
        {activePage === "countryMaster" && <CountryMaster />}
        {activePage === "stateMaster" && <StateMaster />}
        {activePage === "cityMaster" && <CityMaster />}
        {/* {activePage === "currencyMaster" && <CurrencyMaster />} */}
        {activePage === "gstSlabMaster" && <GifDisplay />}
        {activePage === "approvalRole" && <GifDisplay />}
      </main>
    </div>
  );
};

export default Dashboard;
