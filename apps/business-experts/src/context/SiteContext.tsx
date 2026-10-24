import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet, type Settings } from "../api";

const SiteContext = createContext<Settings | null>(null);

export function useSite() {
  return useContext(SiteContext);
}

export function useSeo(title?: string, description?: string) {
  const settings = useSite();
  useEffect(() => {
    const baseTitle = settings?.seo?.title || settings?.brand?.name || "Business Experts";
    document.title = title ? `${title} | ${settings?.brand?.name || "Business Experts"}` : baseTitle;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const text = description || settings?.seo?.description;
    if (meta && text) meta.content = text;
  }, [title, description, settings]);
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    apiGet<Settings>("/settings")
      .then((data) => {
        setSettings(data);
        const root = document.documentElement;
        if (data.theme?.primary) root.style.setProperty("--color-brand", data.theme.primary);
        if (data.theme?.dark) root.style.setProperty("--color-ink", data.theme.dark);
        if (data.theme?.gray) root.style.setProperty("--color-mist", data.theme.gray);
        if (data.brand?.favicon) {
          const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (icon) icon.href = data.brand.favicon;
        }
      })
      .catch(() => {});
  }, []);

  return <SiteContext.Provider value={settings}>{children}</SiteContext.Provider>;
}
