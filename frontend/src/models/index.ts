export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  releaseDate: string;
  description: string;
  budget: number;
  duration: number;
  recommendedAge: number;
  boxOffice: number;
  categoryIds: string[];
  categories?: Category[];
  rating: number;
  studio: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MovieFilters {
  search?: string;
  category?: string;
  minDuration?: number;
  maxDuration?: number;
  startDate?: string;
  endDate?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}
