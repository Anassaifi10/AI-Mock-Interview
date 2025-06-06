import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};
export const getTechLogos = async (techArray: string[]): Promise<{ tech: string; url: string }[]> => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });
  
  return logoURLs;
};
