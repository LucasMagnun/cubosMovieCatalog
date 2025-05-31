import type { Movie, MovieFilters, PaginatedResponse } from "@/models";
import { api } from "@/service/api";

export const movieService = {
  findAll: async (
    page = 1,
    filters: MovieFilters = {}
  ): Promise<PaginatedResponse<Movie>> => {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", "10");

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.minDuration)
      params.append("minDuration", String(filters.minDuration));
    if (filters.maxDuration)
      params.append("maxDuration", String(filters.maxDuration));
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await api.get<PaginatedResponse<Movie>>(
      `/movies?${params.toString()}`
    );
    return response.data;
  },

  findOne: async (movieId: string): Promise<Movie> => {
    const response = await api.get<Movie>(`/movies/${movieId}`);
    return response.data;
  },

  create: async (movie: Movie): Promise<Movie> => {
    const response = await api.post<Movie>("/movies", movie);
    return response.data;
  },

  update: async (
    movieId: string,
    movie: Omit<Movie, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Movie> => {
    const response = await api.put<Movie>(`/movies/${movieId}`, movie);
    return response.data;
  },
};
