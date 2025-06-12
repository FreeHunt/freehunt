import { api } from "@/lib/api";
import { Company } from "@/lib/interfaces";

export const getCurrentCompany = async (userId: string): Promise<Company> => {
  const response = await api.get(`/companies/user/${userId}`);
  return response.data;
};

export const getCompany = async (companyId: string): Promise<Company> => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};
