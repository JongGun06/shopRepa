import { useState, useEffect } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery, type GetProductsParams } from '../../../store/apiSlice';
import CardProducts from './CardProducts';
import CategoryList from '../../Categories/CategoryList';
import ProductFilters from './ProductFilters';
import FilterModal from './FilterModal'; // <-- Импортируем модальное окно
import './MainPage.css';

const Main = () => {
  // Это состояние отвечает за уже ПРИМЕНЕННЫЕ фильтры
  const [appliedFilters, setAppliedFilters] = useState<Partial<GetProductsParams>>({});
  
  // Это состояние для временного хранения значений в инпутах и модалке
  const [localFilters, setLocalFilters] = useState<Partial<GetProductsParams>>({});

  // Состояние для открытия/закрытия модалки
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Запросы к API
  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery(appliedFilters);
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  // Синхронизируем локальные фильтры, если применились новые
  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);


  const handleFilterChange = (name: keyof GetProductsParams, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    setIsModalOpen(false); // Закрываем модалку после применения
  };

  const handleResetFilters = () => {
    setLocalFilters({});
    setAppliedFilters({});
    setIsModalOpen(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    const newFilters = { category: categoryName, search: undefined };
    setLocalFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const isLoading = isProductsLoading || isCategoriesLoading;

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Каталог Товаров</h1>

        <CategoryList onCategoryClick={handleCategoryClick} />
        <hr className="divider" />
        
        <ProductFilters
          searchTerm={localFilters.search || ''}
          onSearchChange={(value) => handleFilterChange('search', value)}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onOpenModal={() => setIsModalOpen(true)}
        />

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

      <FilterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        filters={localFilters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};

export default Main;