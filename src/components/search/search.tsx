// SearchComponent.tsx
import React from "react";
import { Search } from "lucide-react";
import '../../styles/Search.css'

interface SearchProps {
  placeholder?: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchComponent: React.FC<SearchProps> = ({
  placeholder = "Search...",
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="item-models-search">
      <Search size={20} color="#9ca3af"/>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchComponent;
