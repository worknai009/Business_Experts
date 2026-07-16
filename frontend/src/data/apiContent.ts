import { useEffect, useState } from "react";
import {
  admissionsCta,
  programBrand,
  programConcept,
  programImages,
  programOptions
} from "./perfectManContent";

export type SiteContent = {
  programImages: typeof programImages;
  programBrand: typeof programBrand;
  programConcept: typeof programConcept;
  admissionsCta: typeof admissionsCta;
  heroStats: Array<{ value: string; label: string }>;
};

export type ProgramSession = {
  _id?: string;
  title: string;
  duration: string;
  suitableFor: string;
  schedule?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
};

const fallbackSiteContent: SiteContent = {
  programImages,
  programBrand,
  programConcept,
  admissionsCta,
  heroStats: [
    { value: "8-18", label: "Age Group (Years)" },
    { value: "6+", label: "Training Modules" },
    { value: "4", label: "Flexible Formats" },
    { value: "1:1", label: "Personal Assessment" }
  ]
};

const fallbackSessions: ProgramSession[] = programOptions.map((option, index) => ({
  title: option.program,
  duration: option.duration,
  suitableFor: option.suitableFor,
  sortOrder: index + 1,
  isActive: true
}));

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(fallbackSiteContent);

  useEffect(() => {
    let mounted = true;
    fetch("/api/site-content")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (!mounted) {
          return;
        }
        setContent({
          ...fallbackSiteContent,
          ...data,
          programImages: { ...programImages, ...data.programImages },
          programBrand: { ...programBrand, ...data.programBrand },
          programConcept: { ...programConcept, ...data.programConcept },
          admissionsCta: { ...admissionsCta, ...data.admissionsCta }
        });
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  return content;
}

export function useProgramSessions() {
  const [sessions, setSessions] = useState<ProgramSession[]>(fallbackSessions);

  useEffect(() => {
    let mounted = true;
    fetch("/api/program-sessions")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length) {
          setSessions(data);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  return sessions;
}
