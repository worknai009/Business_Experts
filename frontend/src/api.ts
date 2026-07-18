export type Link = { label: string; url: string };

export type Settings = {
  brand: { name: string; tagline: string; logo: string; favicon: string };
  announcement: { enabled: boolean; text: string; link: string; linkLabel: string };
  popup: {
    enabled: boolean;
    title: string;
    message: string;
    image: string;
    buttonLabel: string;
    buttonLink: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    image: string;
    primaryCta: Link;
    secondaryCta: Link;
    stats: { value: string; label: string }[];
  };
  sections: { key: string; label: string; enabled: boolean }[];
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    mapEmbed: string;
    hours: string;
  };
  social: Record<string, string>;
  footer: {
    about: string;
    copyright: string;
    links: Link[];
    newsletterEnabled: boolean;
    newsletterTitle: string;
    newsletterText: string;
  };
  seo: { title: string; description: string; keywords: string; ogImage: string };
  theme: { primary: string; dark: string; gray: string };
};

export type Service = {
  _id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  gallery: string[];
  video: string;
  logo: string;
  technologies: string[];
  status: string;
  liveUrl: string;
  githubUrl: string;
  completionDate?: string;
  isFeatured: boolean;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  priceLabel: string;
  description: string;
  thumbnail: string;
  images: string[];
  features: string[];
  tags: string[];
  availability: string;
  isFeatured: boolean;
};

export type Course = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  duration: string;
  mode: string;
  level: string;
  price: number;
  priceLabel: string;
  syllabus: string[];
  highlights: string[];
  enrollLink: string;
  startDate?: string;
  isFeatured: boolean;
};

export type EventItem = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  banner: string;
  date?: string;
  time: string;
  venue: string;
  seats: number;
  registrationLink: string;
  gallery: string[];
};

export type Membership = {
  _id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  description: string;
  benefits: string[];
  icon: string;
  isPopular: boolean;
};

export type Testimonial = {
  _id: string;
  name: string;
  company: string;
  role: string;
  image: string;
  rating: number;
  review: string;
  videoUrl: string;
};

export type GalleryItem = {
  _id: string;
  title: string;
  type: "photo" | "video";
  url: string;
  thumbnail: string;
  category: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  banner: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  author: string;
  publishDate?: string;
  seoTitle: string;
  seoDescription: string;
};

export type Faq = { _id: string; question: string; answer: string };

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
};

export type Partner = { _id: string; name: string; logo: string; url: string; type: string };

export type HomeData = {
  settings: Settings;
  services: Service[];
  projects: Project[];
  products: Product[];
  courses: Course[];
  events: EventItem[];
  memberships: Membership[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  faqs: Faq[];
  partners: Partner[];
};

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error || "Request failed.");
  return data as T;
}

export function formatDate(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options
  });
}
