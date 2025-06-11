import { Dayjs } from 'dayjs';

export interface State {
  search: string;
  selectedCategoryId: string;
  createdAfter: Dayjs | null;
  page: number;
  hasMore: boolean;
}

export type Action =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'RESET_FILTERS' };

export const initialState: State = {
  search: '',
  selectedCategoryId: '',
  createdAfter: null,
  page: 1,
  hasMore: true,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, selectedCategoryId: action.payload, page: 1 };
    case 'SET_CREATED_AFTER':
      return { ...state, createdAfter: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'RESET_FILTERS':
      return { ...initialState };
    default:
      return state;
  }
}
