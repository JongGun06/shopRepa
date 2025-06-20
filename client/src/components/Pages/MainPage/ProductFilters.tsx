import React from 'react';
import { type GetProductsParams } from '../../../store/apiSlice';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
  onOpenModal: () => void;
}

const ProductFilters = ({ searchTerm, onSearchChange, onApply, onReset, onOpenModal }: ProductFiltersProps) => {
  return (
    <div className="filters-panel">
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-input main-search"
      />
      <button onClick={onOpenModal} className="filter-button modal-toggle">Фильтры</button>
      <button onClick={onApply} className="filter-button apply">Применить</button>
      <button onClick={onReset} className="filter-button reset">Сбросить</button>
    </div>
  );
};

export default ProductFilters;