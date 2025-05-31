import { Layout } from "@/components/layout";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Movie } from "@/models";
import { Calendar, Clock, DollarSign, Star } from "lucide-react";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const movie = (location.state as Movie) || null;

  if (!movie) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-20">
          <p className="text-gray-600 mb-4">Filme não encontrado.</p>
          <Button onClick={() => navigate("/movieList")}>Voltar</Button>
        </div>
      </Layout>
    );
  }

  console.log(movie);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <Layout>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("/imagens/background.png")` }}
      >
        <Card className="max-w-3xl mx-auto my-8">
          <CardHeader className="p-0">
            <AspectRatio ratio={16 / 9} className="">
              <div className="flex items-center justify-center text-gray-400">
                Imagem do Filme
              </div>
            </AspectRatio>
          </CardHeader>
          <CardContent className="space-y-6">
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <p className="text-sm text-gray-500">
              Original: {movie.originalTitle}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {fmtDate(movie.releaseDate)}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {movie.duration} min
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                {fmtCurrency(movie.budget)}
              </div>
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                {movie.rating?.toFixed(1) ?? "—"}/10
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Categorias:</h3>
              <div className="flex flex-wrap gap-2">
                {movie?.categories?.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Descrição:</h3>
              <p className="whitespace-pre-line">{movie.description}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => navigate("/movieList")}>
              Voltar à lista
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};
