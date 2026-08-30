import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PokemonFiltersState = {
  search: string;
  types: string[];
  generations: number[];
  page: number;
};

const initialState: PokemonFiltersState = {
  search: '',
  types: [],
  generations: [],
  page: 1,
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    toggleType: (state, action: PayloadAction<string>) => {
      const exists = state.types.includes(action.payload);
      state.types = exists
        ? state.types.filter((type) => type !== action.payload)
        : [...state.types, action.payload];
    },
    setGenerations: (state, action: PayloadAction<number[]>) => {
      state.generations = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { setSearch, toggleType, setGenerations, setPage } = pokemonSlice.actions;
export default pokemonSlice.reducer;