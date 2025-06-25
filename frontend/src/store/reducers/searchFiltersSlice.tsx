import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Categoria } from '@/types/api';

interface SearchFiltersState {
  titulo: string;
  categoriaIds: number[];
  page: number;
  limit: number;
  searchTrigger: number;
}

const initialState: SearchFiltersState = {
  titulo: '',
  categoriaIds: [],
  page: 1,
  limit: 10,
  searchTrigger: 0,
};

const searchFiltersSlice = createSlice({
  name: 'searchFilters',
  initialState,
  reducers: {
    setSearchTitulo: (state, action: PayloadAction<string>) => {
      state.titulo = action.payload;
    },
    setSearchCategorias: (state, action: PayloadAction<number[]>) => {
      state.categoriaIds = action.payload;
    },
    setSearchPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSearchLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    triggerSearch: (state) => {
      state.searchTrigger += 1;
      state.page = 1;
    },
    resetSearchFilters: (state) => {
      state.titulo = '';
      state.categoriaIds = [];
      state.page = 1;
      state.limit = 10;
      state.searchTrigger = 0;
    },
  },
});

export const {
  setSearchTitulo,
  setSearchCategorias,
  setSearchPage,
  setSearchLimit,
  triggerSearch,
  resetSearchFilters,
} = searchFiltersSlice.actions;

export default searchFiltersSlice.reducer;
