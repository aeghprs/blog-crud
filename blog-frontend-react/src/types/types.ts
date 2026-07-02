export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      email: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    email: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface CategoryData {
  id: number;
  name: string;
  description: string;
}

export interface PostListItem {
  id: number;
  title: string;
  excerpt: string;
  category_name: string;
  user_id: number;
  user_name: string;
  created_at: string;
}

export type PostFormValues = {
  title: string;
  category_id: number;
  content: string;
  excerpt: string;
  tags: string[];
};