// src/hooks/useMovies.ts
import { useCallback, useEffect, useState } from "react";
import type { Movie, MovieFilters, PaginatedResponse } from "../models/index";
import { api } from "../service/api";

export const useMovies = (page = 1, filters: MovieFilters = {}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await api.get<PaginatedResponse<Movie>>(
        `/movies?${params.toString()}`
      );

      // popula estado com dados paginados
      const { data, page: respPage, limit, total, totalPages } = response.data;
      setMovies(data);
      setPagination({
        total,
        totalPages,
        currentPage: respPage,
        limit,
      });
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar filmes:", err);
      setError("Erro ao carregar filmes");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  // dispara busca sempre que page OU filters mudarem
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // criação, edição e exclusão já refazem lista automaticamente
  const createMovie = async (
    movieData: Omit<Movie, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    await api.post("/movies", movieData);
    await fetchMovies();
  };

  const updateMovie = async (id: string, movieData: Partial<Movie>) => {
    await api.put(`/movies/${id}`, movieData);
    await fetchMovies();
  };

  const deleteMovie = async (id: string) => {
    await api.delete(`/movies/${id}`);
    await fetchMovies();
  };

  return {
    movies,
    loading,
    error,
    pagination,
    createMovie,
    updateMovie,
    deleteMovie,
    refetch: fetchMovies,
  };
};
