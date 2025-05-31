import { FilterModal } from "@/components/filterModal";
import { Layout } from "@/components/layout";
import { MovieCard } from "@/components/movieCard";
import { MovieForm } from "@/components/movieForm";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMovies } from "@/hooks/userMovies";

import type { Movie, MovieFilters } from "@/models";
import { Filter, Loader, Plus, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const MovieList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<MovieFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const appliedFilters = useMemo(
    () => ({ ...filters, search: searchTerm || undefined }),
    [filters, searchTerm]
  );

  const navigate = useNavigate();
  const { movies, loading, pagination, createMovie, updateMovie, deleteMovie } =
    useMovies(currentPage, appliedFilters);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters: MovieFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleAddMovie = () => {
    setEditingMovie(null);
    setIsFormOpen(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setIsFormOpen(true);
  };

  const confirmDeleteMovie = (movie: Movie) => {
    setMovieToDelete(movie);
    setIsDeleteOpen(true);
  };

  const handleDeleteMovie = async () => {
    if (!movieToDelete) return;
    await deleteMovie(movieToDelete.id);
    setIsDeleteOpen(false);
    setMovieToDelete(null);
  };

  const handleViewMovie = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { state: movie });
  };

  const handleSubmitMovie = async (
    movieData: Omit<Movie, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    if (editingMovie) {
      await updateMovie(editingMovie.id, movieData);
    } else {
      await createMovie(movieData);
    }
    setIsFormOpen(false);
    setEditingMovie(null);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold">Meus Filmes</h1>
        <Button onClick={handleAddMovie}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Filme
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          variant={hasActiveFilters ? "secondary" : "outline"}
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      )}

      {/* Grid de filmes */}
      {!loading && (
        <>
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies?.map((m: Movie) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  onEdit={handleEditMovie}
                  onDelete={() => confirmDeleteMovie(m)}
                  onView={handleViewMovie}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || hasActiveFilters
                ? "Nenhum filme encontrado"
                : "Nenhum filme cadastrado"}
            </div>
          )}

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modais */}
      <MovieForm
        movie={editingMovie}
        onSubmit={handleSubmitMovie}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMovie(null);
        }}
        isOpen={isFormOpen}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="mt-4">
            Tem certeza que deseja excluir{" "}
            <strong>{movieToDelete?.title}</strong>? Essa ação não pode ser
            desfeita.
          </p>
          <DialogFooter className="mt-6 flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteMovie}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
