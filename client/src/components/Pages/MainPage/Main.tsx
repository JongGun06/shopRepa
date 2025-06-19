// client/src/components/Pages/MainPage/Main.tsx (ФИНАЛЬНАЯ ВЕРСИЯ)
import { useState } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery, type GetProductsParams } from '../../../store/apiSlice';
import CardProducts from './CardProducts';
import ProductFilters from './ProductFilters'; 
import CategoryList from '../../Categories/CategoryList';
import './MainPage.css';

const Main = () => {
  const [filterParams, setFilterParams] = useState<Partial<GetProductsParams>>({});

  const { data: products = [], isLoading: isLoadingProducts, isSuccess, isError, error } = useGetProductsQuery(filterParams);
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const handleApplyFilters = (params: GetProductsParams) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== '' && value != null && value !== undefined)
    );
    setFilterParams(cleanParams);
  };

  const handleCategoryClick = (categoryName: string) => {
    const newFilters = { category: categoryName };
    setFilterParams(newFilters);
  };

  let content;
  if (isLoadingProducts) {
    content = <p>Загрузка...</p>;
  } else if (isError) {
    content = <p>Ошибка при загрузке: {JSON.stringify(error)}</p>;
  } else if (isSuccess && products.length > 0) {
    content = (
      <div className="products-grid">
        {products.map(product => (
          <CardProducts key={product._id} product={product} />
        ))}
      </div>
    );
  } else {
    content = <p>По вашему запросу ничего не найдено.</p>;
  }

  return (
    <div className="main-container">
      {/* Теперь передача пропсов в ProductFilters корректна */}
      <ProductFilters 
        categories={categories}
        onApplyFilters={handleApplyFilters}
        currentFilters={filterParams}
      />
      
      {isLoadingCategories ? <p>Загрузка категорий...</p> : (
        <CategoryList onCategoryClick={handleCategoryClick} />
      )}

      <hr className="divider" />
      
      <h2>{filterParams.category || 'Все объявления'}</h2>
      <div className="content-wrapper">
        {content}
      </div>
    </div>
  );
};

export default Main;