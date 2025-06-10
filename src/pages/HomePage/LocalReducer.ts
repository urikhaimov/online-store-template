import dayjs, { Dayjs } from 'dayjs';
import type { Product } from '../../types/firebase';
import type { Category } from '../../types/firebase';


export interface VirtualRow {
  type: 'category' | 'product';
  data: Category | Product;
}

export interface FilterState {
  searchTerm: string;
  selectedCategoryId: string;
  createdAfter: Dayjs | null;
}

export type FilterAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null };

export const initialFilterState: FilterState = {
  searchTerm: '',
  selectedCategoryId: '',
  createdAfter: null,
};

export function localReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_CATEGORY_FILTER':
      return { ...state, selectedCategoryId: action.payload };
    case 'SET_CREATED_AFTER':
      return { ...state, createdAfter: action.payload };
    default:
      return state;
  }
}
