import { api } from "@/lib/api";

export const getCurrentUser = async () => {
  const response = await api.get("/auth/getme", {
    withCredentials: true,
  });
  return response.data;
};
