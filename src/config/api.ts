import axios from 'axios';

export const POKEAPI_BASE_URL =
  import.meta.env.VITE_POKEAPI_URL ?? 'https://pokeapi.co/api/v2/';

export const api = axios.create({
  baseURL: POKEAPI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});