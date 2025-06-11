import { Dayjs } from 'dayjs';
import { Product } from '../../../types/firebase';

export interface State {
  products: Product[];
  lastDoc: any;
  loading: boolean;
  hasMore: boolean;
  searchTerm: string;
  selectedCategoryId: string;
  createdAfter: Dayjs | null;
  page: number;
  successMessage: string;
  pendingDelete: Product | null;
}

export type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCTS'; payload: Product[] }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'SET_LAST_DOC'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null }
  | { type: 'RESET_FILTERS' }
  | { type: 'INCREMENT_PAGE' }
  | { type: 'DECREMENT_PAGE' }
  | { type: 'SET_SUCCESS_MESSAGE'; payload: string }
  | { type: 'CLEAR_SUCCESS_MESSAGE' }
  | { type: 'SET_PENDING_DELETE'; payload: Product | null };

export const initialState: State = {
  products: [],
  lastDoc: null,
  loading: false,
  hasMore: true,
  searchTerm: '',
  selectedCategoryId: '',
  createdAfter: null,
  page: 1,
  successMessage: '',
  pendingDelete: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCTS':
      return { ...state, products: [...state.products, ...action.payload] };
    case 'REMOVE_PRODUCT':
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case 'SET_LAST_DOC':
      return { ...state, lastDoc: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, page: 1 };
    case 'SET_CATEGORY_FILTER':
      return { ...state, selectedCategoryId: action.payload, page: 1 };
    case 'SET_CREATED_AFTER':
      return { ...state, createdAfter: action.payload, page: 1 };
    case 'RESET_FILTERS':
      return {
        ...state,
        searchTerm: '',
        selectedCategoryId: '',
        createdAfter: null,
        page: 1,
      };
    case 'INCREMENT_PAGE':
      return { ...state, page: state.page + 1 };
    case 'DECREMENT_PAGE':
      return { ...state, page: Math.max(1, state.page - 1) };
    case 'SET_SUCCESS_MESSAGE':
      return { ...state, successMessage: action.payload };
    case 'CLEAR_SUCCESS_MESSAGE':
      return { ...state, successMessage: '' };
    case 'SET_PENDING_DELETE':
      return { ...state, pendingDelete: action.payload };
    default:
      return state;
  }
}
