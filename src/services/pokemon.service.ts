import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axiosBaseQuery';
import { api } from '../config/api';

export interface PokemonSummary {
  name: string;
  id: number;
  image: string;
  types: string[];
}

const mapPokemonDetail = (pokemon: any): PokemonSummary => ({
  name: pokemon.name,
  id: pokemon.id,
  types: pokemon.types?.map((type: { type: { name: string } }) => type.type.name) ?? [],
  image:
    pokemon.sprites?.front_default ||
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    '',
});

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Pokemon', 'PokemonList'],
  endpoints: (builder) => ({
    getPokemonList: builder.query({
      query: ({ limit = 151, offset = 0 } = {}) => ({
        url: 'pokemon',
        params: { limit, offset },
      }),
      providesTags: ['PokemonList'],
    }),
    getPokemonPageWithDetails: builder.query<
      PokemonSummary[],
      { limit?: number; offset?: number }
    >({
      async queryFn({ limit = 30, offset = 0 } = {}) {
        try {
          const response = await api.get('pokemon', {
            params: { limit, offset },
          });

          const results = Array.isArray(response.data?.results)
            ? response.data.results
            : [];

          const detailedPokemons = await Promise.all(
            results.map(async ({ name }: { name: string }) => {
              const details = await api.get(`pokemon/${name}`);
              return mapPokemonDetail(details.data);
            })
          );

          return {
            data: detailedPokemons.sort((a, b) => a.id - b.id),
          };
        } catch (error: any) {
          return {
            error: {
              status: error.response?.status ?? 500,
              data: error.response?.data ?? error.message,
              message: error.message,
            },
          };
        }
      },
      providesTags: ['PokemonList'],
    }),
    getPokemonByName: builder.query({
      query: (name: string) => ({
        url: `pokemon/${name}`,
      }),
      providesTags: (_result, _error, name) => [{ type: 'Pokemon', id: name }],
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonPageWithDetailsQuery,
  useGetPokemonByNameQuery,
} = pokemonApi;