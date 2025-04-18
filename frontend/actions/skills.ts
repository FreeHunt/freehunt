"use server";

import { api } from "@/lib/api";
import { Skill } from "@/lib/interfaces";

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get("/skills");
  return response.data;
};
