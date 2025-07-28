import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Categoria } from '@/types/api';

interface SearchFiltersState {
  titulo: string;
  categoriaIds: number[];
  page: number;
  limit: number;
  searchTrigger: number;
  categoriasDisponibles: Categoria[];
}

const initialState: SearchFiltersState = {
  titulo: '',
  categoriaIds: [],
  page: 1,
  limit: 50,
  searchTrigger: 0,
  categoriasDisponibles: [],
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
      state.limit = 50;
      state.searchTrigger = 0;
    },
    setCategoriasDisponibles: (state, action: PayloadAction<Categoria[]>) => {
      state.categoriasDisponibles = action.payload;
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
  setCategoriasDisponibles,
} = searchFiltersSlice.actions;

export default searchFiltersSlice.reducer;