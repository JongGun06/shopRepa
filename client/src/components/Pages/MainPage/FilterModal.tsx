import React from 'react';
import { type Category } from '../../../types';
import { type GetProductsParams } from '../../../store/apiSlice';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  filters: Partial<GetProductsParams>;
  onFilterChange: (name: keyof GetProductsParams, value: string | number) => void;
  onApply: () => void;
  onReset: () => void;
}

const FilterModal = ({ isOpen, onClose, categories, filters, onFilterChange, onApply, onReset }: FilterModalProps) => {
  if (!isOpen) return null;

  const handleNumericChange = (name: keyof GetProductsParams, value: string) => {
    onFilterChange(name, value === '' ? '' : Number(value));
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="filter-modal">
        <div className="modal-header">
          <h3>Фильтры</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label>Категория</label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">Все категории</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Сортировка</label>
            <select
              value={filters.sortBy || 'default'}
              onChange={(e) => onFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="default">По умолчанию</option>
              <option value="dateNew">Сначала новые</option>
              <option value="priceAsc">Сначала дешевле</option>
              <option value="priceDesc">Сначала дороже</option>
            </select>
          </div>
          <div className="form-group price-range">
            <div>
                <label>Цена от</label>
                <input
                    type="number"
                    placeholder="0"
                    value={filters.price_gte || ''}
                    onChange={(e) => handleNumericChange('price_gte', e.target.value)}
                    className="filter-input"
                />
            </div>
            <div>
                <label>Цена до</label>
                <input
                    type="number"
                    placeholder="99999"
                    value={filters.price_lte || ''}
                    onChange={(e) => handleNumericChange('price_lte', e.target.value)}
                    className="filter-input"
                />
            </div>
          </div>
        </div>
        <div className="modal-footer">
            <button onClick={onReset} className="filter-button reset">Сбросить</button>
            <button onClick={onApply} className="filter-button apply">Применить</button>
        </div>
      </div>
    </>
  );
};

export default FilterModal;