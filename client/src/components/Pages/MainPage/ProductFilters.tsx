// client/src/components/Pages/MainPage/ProductFilters.tsx (ИСПРАВЛЕННАЯ ВЕРСИЯ)
import React, { useState, useEffect } from 'react';
import { type Category } from '../../../types';
import { type GetProductsParams } from '../../../store/apiSlice';

// Описываем пропсы, которые компонент теперь принимает
interface ProductFiltersProps {
  categories: Category[];
  onApplyFilters: (params: GetProductsParams) => void;
  currentFilters: Partial<GetProductsParams>;
}

const ProductFilters = ({ categories, onApplyFilters, currentFilters }: ProductFiltersProps) => {
  // Локальные состояния для каждого поля ввода
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [minPrice, setMinPrice] = useState(currentFilters.price_gte?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.price_lte?.toString() || '');
  const [sortOption, setSortOption] = useState(currentFilters.sortBy || 'default');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '');

  // Этот useEffect синхронизирует состояние фильтров, если они меняются извне
  // (например, когда ты кликаешь на иконку категории)
  useEffect(() => {
    setSelectedCategory(currentFilters.category || '');
  }, [currentFilters.category]);

  const handleApply = () => {
    onApplyFilters({
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      price_gte: minPrice ? Number(minPrice) : undefined,
      price_lte: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortOption,
    });
  };

  const handleReset = () => {
    // Очищаем локальные состояния
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('default');
    setSelectedCategory('');
    // Применяем пустые фильтры наверху
    onApplyFilters({});
  };

  return (
    <div className="filters-panel">
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="filter-input"
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="filter-select"
      >
        <option value="">Все категории</option>
        {/* Наполняем список категориями, полученными из пропсов */}
        {categories.map(cat => (
          <option key={cat._id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Цена от"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="filter-input price"
      />
      <input
        type="number"
        placeholder="Цена до"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="filter-input price"
      />

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="filter-select"
      >
        <option value="default">По умолчанию</option>
        <option value="dateNew">Сначала новые</option>
        <option value="priceAsc">Сначала дешевле</option>
        <option value="priceDesc">Сначала дороже</option>
      </select>

      <button onClick={handleApply} className="filter-button apply">Применить</button>
      <button onClick={handleReset} className="filter-button reset">Сбросить</button>
    </div>
  );
};

export default ProductFilters;