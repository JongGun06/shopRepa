// client/src/components/Categories/CategoryList.tsx (НОВЫЙ ФАЙЛ)
import { useGetCategoriesQuery } from '../../store/apiSlice';
import './CategoryList.css';

interface CategoryListProps {
  onCategoryClick: (categoryName: string) => void;
}

const CategoryList = ({ onCategoryClick }: CategoryListProps) => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  if (isLoading) return <p>Загрузка категорий...</p>;

  return (
    <div className="categories-container">
      <h2>Категории</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat._id} className="category-item" onClick={() => onCategoryClick(cat.name)}>
            <div className="category-icon" dangerouslySetInnerHTML={{ __html: cat.icon }} />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;