import { configureStore } from '@reduxjs/toolkit';
//? Reducers
import pokemonReducer from './slices/pokemonSlice';
import { pokemonApi } from '../services/pokemon.service';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;