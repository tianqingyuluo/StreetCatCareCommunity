import axios from 'axios';

export const request = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 10000,
});