import api from "api/api";

import type { ICreateCategory } from "schema/category";

export const getCategories = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`categories?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchCategories = ({
  queryKey,
}: {
  queryKey: [string, number, number];
}) => {
  const [, page, limit] = queryKey;
  return getCategories(page, limit);
};

export const createNewCategory = async (data: ICreateCategory) => {
  const response = await api.post(`categories/new`, data);
  return response.data;
};

export const updateCategory = async (id: number, data: ICreateCategory) => {
  const response = await api.put(`categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`categories/${id}`);

  return response.data;
};
