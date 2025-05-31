"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

import type { Category, Movie } from "@/models";
import { categoryService } from "@/service/category";

interface MovieFormProps {
  movie?: Movie | null;
  onSubmit: (
    movieData: Omit<Movie, "id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export const MovieForm: React.FC<MovieFormProps> = ({
  movie,
  onSubmit,
  onClose,
  isOpen,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    originalTitle: "",
    releaseDate: "",
    description: "",
    budget: 0,
    duration: 0,
    category: [] as string[],
    recommendedAge: 0,
    boxOffice: 0,
    studio: "",
    rating: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catFilter, setCatFilter] = useState("");

  // Carrega categorias ao montar
  useEffect(() => {
    categoryService
      .findAll()
      .then(setCategories)
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  useEffect(() => {
    if (movie) {
      // garante que categories seja sempre um array:
      const cats: Category[] = movie?.categories ?? [];

      const ids =
        movie.categoryIds?.length > 0
          ? movie?.categoryIds
          : cats.map((c) => c.id);

      setFormData({
        title: movie.title,
        originalTitle: movie.originalTitle,
        releaseDate: movie.releaseDate.split("T")[0],
        description: movie.description,
        budget: movie.budget,
        duration: movie.duration,
        category: ids, // ← aqui
        recommendedAge: movie.recommendedAge ?? 0,
        boxOffice: movie.boxOffice ?? 0,
        studio: movie.studio ?? "",
        rating: movie.rating ?? 0,
      });
    } else {
      setFormData({
        title: "",
        originalTitle: "",
        releaseDate: "",
        description: "",
        budget: 0,
        duration: 0,
        category: [],
        recommendedAge: 0,
        boxOffice: 0,
        studio: "",
        rating: 0,
      });
    }
    setCatFilter("");
    setErrors({});
  }, [movie, isOpen]);

  // Atualiza campo genérico
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const parsed = type === "number" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: parsed }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Toggle de categorias no multi-select
  const toggleCategory = (id: string) => {
    setFormData((prev) => {
      const next = prev?.category?.includes(id)
        ? prev?.category?.filter((v) => v !== id)
        : [...prev?.category, id];
      return { ...prev, category: next };
    });
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  // Validação antes de submeter
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = "Título é obrigatório";
    if (!formData.originalTitle.trim())
      errs.originalTitle = "Título original é obrigatório";
    if (!formData.releaseDate)
      errs.releaseDate = "Data de lançamento é obrigatória";
    if (!formData.description.trim())
      errs.description = "Descrição é obrigatória";
    if (formData.budget <= 0) errs.budget = "Orçamento deve ser maior que zero";
    if (formData.duration <= 0)
      errs.duration = "Duração deve ser maior que zero";
    if (formData.category.length === 0)
      errs.category = "Selecione ao menos uma categoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ ...formData, categoryIds: formData.category });
      onClose();
    } catch (err) {
      console.error("Erro ao salvar filme:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtra categorias pelo termo de busca
  const filteredCats = categories?.filter((c) =>
    c.name?.toLowerCase()?.includes(catFilter.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>
            {movie ? "Editar Filme" : "Adicionar Filme"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 my-2">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Título Original */}
            <div className="space-y-2">
              <Label htmlFor="originalTitle">Título Original *</Label>
              <Input
                id="originalTitle"
                name="originalTitle"
                value={formData.originalTitle}
                onChange={handleChange}
              />
              {errors.originalTitle && (
                <p className="text-red-500 text-sm">{errors.originalTitle}</p>
              )}
            </div>

            {/* Data de Lançamento */}
            <div className="space-y-2">
              <Label htmlFor="releaseDate">Data de Lançamento *</Label>
              <Input
                id="releaseDate"
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
              />
              {errors.releaseDate && (
                <p className="text-red-500 text-sm">{errors.releaseDate}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Valores numéricos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento (USD) *</Label>
                <Input
                  id="budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                />
                {errors.budget && (
                  <p className="text-red-500 text-sm">{errors.budget}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="boxOffice">Bilheteria (USD)</Label>
                <Input
                  id="boxOffice"
                  type="number"
                  name="boxOffice"
                  value={formData.boxOffice}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (min) *</Label>
                <Input
                  id="duration"
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm">{errors.duration}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="recommendedAge">Idade Recomendada</Label>
                <Input
                  id="recommendedAge"
                  type="number"
                  name="recommendedAge"
                  value={formData.recommendedAge}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studio">Estúdio</Label>
                <Input
                  id="studio"
                  name="studio"
                  value={formData.studio}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Nota (1 a 10)</Label>
                <Input
                  id="rating"
                  type="number"
                  name="rating"
                  min={0}
                  max={10}
                  step={0.1}
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Multi-select de Categorias */}
            <div className="space-y-2">
              <Label htmlFor="category">Categorias *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData?.category?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {formData?.category?.map((id) => {
                          const cat = categories.find((c) => c.id === id);
                          return (
                            <Badge key={id} variant="secondary">
                              {cat?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      "Selecione categorias..."
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar categorias..."
                      value={catFilter}
                      onValueChange={setCatFilter}
                    />
                    <CommandEmpty>Nenhuma categoria encontrada</CommandEmpty>
                    <CommandGroup>
                      {filteredCats?.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          onSelect={() => toggleCategory(cat.id)}
                          className="flex items-center justify-between"
                        >
                          {cat.name}
                          {formData?.category?.includes(cat.id) && (
                            <Check className="h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : movie ? "Atualizar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
