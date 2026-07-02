
import axios from "axios";

import api from "api/api";

import type { PostFormValues } from "types/types";

export const getBlogs = async (page: number = 1, limit: number = 10, searchQuery: string = "") => {
  const response = await api.get(`blogs?page=${page}&limit=${limit}&search=${searchQuery}`);
  return response.data;
};

export const fetchBlogs = ({
  queryKey,
}: {
  queryKey: [string, number, number, string];
}) => {
  const [, page, limit, searchQuery] = queryKey;
  return getBlogs(page, limit, searchQuery);
};

export const createNewBlog = async (data: PostFormValues) => {
  const response = await api.post(`blogs/new`, data);
  return response.data;
};

export const updateBlog = async (id: number, data: PostFormValues) => {
  const response = await api.put(`blogs/${id}`, data);
  return response.data;
};

export const deleteBlog = async (id: number) => {
  const response = await api.delete(`blogs/${id}`);

  return response.data;
};

const BASE_URL = import.meta.env.VITE_API_URL;

export const getBlogPostById = async (id: number) => {
  const response = await axios.get(`${BASE_URL}/blogs/${id}`);

  return response.data.data;
};

export const fetchAllBlogs = ({
  queryKey,
}: {
  queryKey: [string, number, number, string];
}) => {
  const [, page, limit, searchQuery] = queryKey;
  return getAllBlogPostById(page, limit, searchQuery);
};

export const getAllBlogPostById = async (page: number, limit: number, searchQuery: string) => {
  const response = await axios.get(
    `${BASE_URL}/blogs/all??page=${page}&limit=${limit}&search=${searchQuery}`,
  );

  return response.data;
};
