// client/src/store/types.ts (НОВЫЙ ФАЙЛ)

// Тип для параметров фильтрации
export interface GetProductsParams {
  search?: string;
  category?: string;
  price_gte?: number;
  price_lte?: number;
  sortBy?: string;
}

// Тип для категории
export interface Category {
  _id: string;
  name: string;
  icon: string;
}