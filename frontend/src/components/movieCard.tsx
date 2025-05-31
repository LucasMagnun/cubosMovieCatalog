import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Movie } from "@/models";
import { Calendar, Clock, DollarSign, Edit, Eye, Trash2 } from "lucide-react";
import React from "react";

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
  onView: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onEdit,
  onDelete,
  onView,
}) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  return (
    <Card
      onClick={() => onView(movie)}
      onKeyDown={(e) => e.key === "Enter" && onView(movie)}
      tabIndex={0}
      role="button"
      aria-labelledby={`movie-title-${movie.id}`}
      className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow hover:shadow-lg"
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9} className="">
          {
            <div className="flex items-center justify-center text-gray-400">
              Imagem
            </div>
          }
        </AspectRatio>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <CardTitle
            id={`movie-title-${movie.id}`}
            className="text-base line-clamp-2"
          >
            {movie.title}
          </CardTitle>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onView(movie);
              }}
              aria-label="Ver detalhes"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(movie);
              }}
              aria-label="Editar"
            >
              <Edit className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(movie.id);
              }}
              aria-label="Excluir"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>

        {movie.originalTitle !== movie.title && (
          <p className="text-xs text-gray-500 mt-1">
            Original: {movie.originalTitle}
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {movie.description}
        </p>

        <div className="mt-4 space-y-2 text-xs text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(movie.releaseDate)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {movie.duration} min
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            {formatCurrency(movie.budget)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {movie?.categoryIds?.map((id) => (
            <Badge key={id} variant="secondary" className="text-[10px]">
              {id}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onView(movie);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
};
