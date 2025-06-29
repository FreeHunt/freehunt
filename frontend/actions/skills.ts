"use client";

import { api } from "@/lib/api";
import { Skill, SkillCreate } from "@/lib/interfaces";

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get("/skills");
  return response.data;
};

export const createSkill = async (skill: SkillCreate): Promise<Skill> => {
  try {
    const response = await api.post("/skills", skill);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to create skill");
  }
};
