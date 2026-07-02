
import axios from "axios";

import api from "api/api";

export const getBlogs = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`blogs?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchBlogs = ({
  queryKey,
}: {
  queryKey: [string, number, number];
}) => {
  const [, page, limit] = queryKey;
  return getBlogs(page, limit);
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
  queryKey: [string, number, number];
}) => {
  const [, page, limit] = queryKey;
  return getAllBlogPostById(page, limit);
};

export const getAllBlogPostById = async (page: number, limit: number) => {
  const response = await axios.get(
    `${BASE_URL}/blogs/all??page=${page}&limit=${limit}`,
  );

  return response.data;
};
