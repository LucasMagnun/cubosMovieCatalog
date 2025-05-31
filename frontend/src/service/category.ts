import type { Category } from "@/models";
import { api } from "@/service/api";

export const categoryService = {
  findAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/category");
    return response.data;
  },

  findOne: async (categoryId: string): Promise<Category> => {
    const response = await api.get<Category>(`/category/${categoryId}`);
    return response.data;
  },
};
