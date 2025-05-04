import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
