import { Dayjs } from 'dayjs';
import {Category, Product} from '../../../types/firebase' 



 interface State {
    deleteDialogOpen: boolean;
    selectedProductId: string | null;
    successMessage: string;
    searchTerm: string;
    selectedCategoryId: string;
    createdAfter: Dayjs | null;
    page: number;
    pageSize: number;
}

 type Action =
    | { type: 'OPEN_DELETE_DIALOG'; payload: string }
    | { type: 'CLOSE_DELETE_DIALOG' }
    | { type: 'SET_SUCCESS_MESSAGE'; payload: string }
    | { type: 'CLEAR_SUCCESS_MESSAGE' }
    | { type: 'SET_SEARCH_TERM'; payload: string }
    | { type: 'SET_CATEGORY_FILTER'; payload: string }
    | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null } // ✅ fixed here
    | { type: 'INCREMENT_PAGE'; payload: number }; // ✅ fixed here

 const initialState: State = {
    deleteDialogOpen: false,
    selectedProductId: null,
    successMessage: '',
    searchTerm: '',
    selectedCategoryId: '',
    createdAfter: null,
    page: 1,
    pageSize: 10,
};

export type VirtualRow = 
  | { type: 'category'; data: Category }
  | { type: 'product'; data: Product };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'OPEN_DELETE_DIALOG':
            return { ...state, deleteDialogOpen: true, selectedProductId: action.payload };
        case 'CLOSE_DELETE_DIALOG':
            return { ...state, deleteDialogOpen: false, selectedProductId: null };
        case 'SET_SUCCESS_MESSAGE':
            return { ...state, successMessage: action.payload };
        case 'CLEAR_SUCCESS_MESSAGE':
            return { ...state, successMessage: '' };
        case 'SET_SEARCH_TERM':
            return { ...state, searchTerm: action.payload };
        case 'SET_CATEGORY_FILTER':
            return { ...state, selectedCategoryId: action.payload };
        case 'SET_CREATED_AFTER':
            return { ...state, createdAfter: action.payload };
        case 'INCREMENT_PAGE':
            return { ...state, page: state.page + 1 };
        default:
            return state;
    }
}

export { initialState, reducer, State, Action };
