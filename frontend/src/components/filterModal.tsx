import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, MovieFilters } from "@/models";
import { categoryService } from "@/service/category";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: MovieFilters) => void;
  currentFilters: MovieFilters;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<MovieFilters>({});
  const [categories, setCategories] = useState<Category[]>([]);

  // sempre que abrir ou currentFilters mudar, reseta o estado interno
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  // carrega lista de categorias uma única vez
  useEffect(() => {
    categoryService.findAll().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleSelectCategory = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value === "all" ? undefined : value,
    }));
  };

  const handleReset = () => {
    const empty: MovieFilters = {};
    setFilters(empty);
    onApplyFilters(empty);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-primary-foreground" />
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Categoria por ID */}
          <div className="space-y-1">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={filters.category ?? "all"}
              onValueChange={handleSelectCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Duração */}
          <div className="space-y-1">
            <Label>Duração (min)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="minDuration"
                type="number"
                placeholder="Mín"
                value={filters.minDuration ?? ""}
                onChange={handleChange}
              />
              <Input
                name="maxDuration"
                type="number"
                placeholder="Máx"
                value={filters.maxDuration ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Data de lançamento */}
          <div className="space-y-1">
            <Label>Data de Lançamento</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="startDate"
                type="date"
                value={filters.startDate ?? ""}
                onChange={handleChange}
              />
              <Input
                name="endDate"
                type="date"
                value={filters.endDate ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleReset}>
              Limpar
            </Button>
            <div className="space-x-2">
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Aplicar</Button>
            </div>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
