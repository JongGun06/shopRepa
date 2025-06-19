// client/src/components/Pages/MainPage/Main.tsx (ОБНОВЛЕННАЯ ВЕРСИЯ)

import { useState } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery, type GetProductsParams } from '../../../store/apiSlice';
import CardProducts from './CardProducts';
import CategoryList from '../../Categories/CategoryList'; // <-- Импортируем компонент категорий
import ProductFilters from './ProductFilters'; // <-- Импортируем компонент фильтров
import './MainPage.css';

const Main = () => {
  // Единое состояние для всех фильтров
  const [filters, setFilters] = useState<Partial<GetProductsParams>>({});

  // Запрос на получение товаров с учетом текущих фильтров
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery(filters);

  // Запрос на получение списка всех категорий
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  // Функция для применения фильтров из компонента ProductFilters
  const handleApplyFilters = (newFilters: GetProductsParams) => {
    setFilters(newFilters);
  };

  // Функция для обработки клика по категории из CategoryList
  const handleCategoryClick = (categoryName: string) => {
    // При клике на категорию, мы обновляем фильтры
    const newFilters = { ...filters, category: categoryName, search: undefined }; // Сбрасываем поиск
    setFilters(newFilters);
  };

  // Показываем состояние загрузки, пока грузятся и товары и категории
  const isLoading = isProductsLoading || isCategoriesLoading;

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Каталог Товаров</h1>

        {/* ================================================================= */}
        {/* ВОТ ЗДЕСЬ МЫ ВОЗВРАЩАЕМ ВАШИ КАТЕГОРИИ */}
        <CategoryList
          onCategoryClick={handleCategoryClick}
        />
        <hr className="divider" />
        {/* ================================================================= */}

        {/* Панель с фильтрами (поиск, цена и т.д.) */}
        <ProductFilters
          categories={categories}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters} // Передаем текущие фильтры
        />

        {/* Отображение товаров */}
        <div className="products-grid">
          {isLoading ? (
            <p>Загрузка товаров...</p>
          ) : products.length > 0 ? (
            products.filter(product => product.quantity > 0).map(product => (
              <CardProducts key={product._id} product={product} />
            ))
          ) : (
            <p>Товары не найдены.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;