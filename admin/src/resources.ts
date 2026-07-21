import type { Field } from "./fields";

export type ResourceConfig = {
  key: string;
  singular: string;
  plural: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  hasFeature?: boolean;
  fields: Field[];
};

export const RESOURCES: ResourceConfig[] = [
  {
    key: "services",
    singular: "Service",
    plural: "Services",
    titleField: "title",
    subtitleField: "description",
    imageField: "image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", half: true, hint: "Leave empty to auto-generate from the title" },
      { name: "icon", label: "Icon", type: "select", half: true, options: ["trending-up", "headset", "handshake", "heart-handshake", "network", "users", "briefcase", "rocket", "user-check", "box", "calendar", "pen", "image", "mic", "building"] },
      { name: "order", label: "Display order", type: "number", half: true },
      { name: "description", label: "Short description", type: "textarea" },
      { name: "fullDescription", label: "Full details (shown on the service page)", type: "richtext" },
      { name: "image", label: "Image", type: "image" },
      { name: "features", label: "Highlights", type: "list", hint: "Short bullet points shown as chips" }
    ]
  },
  {
    key: "projects",
    singular: "Project",
    plural: "Projects",
    titleField: "title",
    subtitleField: "category",
    imageField: "coverImage",
    hasFeature: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "category", label: "Category", type: "text", half: true, placeholder: "e.g. FinTech Platform" },
      { name: "slug", label: "Slug", type: "text", half: true, hint: "Leave empty to auto-generate from the title" },
      { name: "status", label: "Status", type: "select", half: true, options: ["Planned", "In Progress", "Completed"] },
      { name: "shortDescription", label: "Short description", type: "textarea" },
      { name: "fullDescription", label: "Full description", type: "richtext" },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "logo", label: "Logo", type: "image" },
      { name: "gallery", label: "Gallery", type: "images" },
      { name: "video", label: "Video embed URL", type: "text", placeholder: "https://www.youtube.com/embed/…" },
      { name: "technologies", label: "Technologies", type: "list" },
      { name: "liveUrl", label: "Live URL", type: "text", half: true },
      { name: "githubUrl", label: "GitHub URL", type: "text", half: true },
      { name: "completionDate", label: "Completion date", type: "date", half: true },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  },
  {
    key: "courses",
    singular: "Training program",
    plural: "Training Programs",
    titleField: "title",
    subtitleField: "category",
    imageField: "image",
    hasFeature: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "category", label: "Category", type: "text", half: true, placeholder: "e.g. Business Training" },
      { name: "slug", label: "Slug", type: "text", half: true, hint: "Leave empty to auto-generate from the title" },
      { name: "level", label: "Level", type: "select", half: true, options: ["Beginner", "Intermediate", "Advanced", "All Levels"] },
      { name: "mode", label: "Mode", type: "select", half: true, options: ["Online", "Offline", "Hybrid"] },
      { name: "duration", label: "Duration", type: "text", half: true, placeholder: "e.g. 6 weeks" },
      { name: "price", label: "Price (number)", type: "number", half: true },
      { name: "priceLabel", label: "Price label", type: "text", half: true, placeholder: "e.g. ₹14,999", hint: "Shown instead of the raw number when set" },
      { name: "startDate", label: "Next batch date", type: "date", half: true },
      { name: "order", label: "Display order", type: "number", half: true },
      { name: "shortDescription", label: "Short description", type: "textarea" },
      { name: "description", label: "Full description", type: "richtext" },
      { name: "image", label: "Cover image", type: "image" },
      { name: "syllabus", label: "Syllabus / modules", type: "list", hint: "One module or topic per line" },
      { name: "highlights", label: "Highlights", type: "list", hint: "e.g. Certificate included, Live mentorship" },
      { name: "enrollLink", label: "Enroll link", type: "text", placeholder: "External form / payment link (optional)" },
      { name: "video", label: "Intro video URL", type: "text", placeholder: "Paste a YouTube or Vimeo link", hint: "Any YouTube/Vimeo link works — share, watch, or embed URL" }
    ]
  },
  {
    key: "events",
    singular: "Event",
    plural: "Events",
    titleField: "title",
    subtitleField: "venue",
    imageField: "banner",
    hasFeature: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "banner", label: "Banner image", type: "image" },
      { name: "date", label: "Date", type: "date", half: true },
      { name: "time", label: "Time", type: "text", half: true, placeholder: "e.g. 9:30 AM – 6:00 PM" },
      { name: "venue", label: "Venue", type: "text", half: true },
      { name: "seats", label: "Seats", type: "number", half: true },
      { name: "registrationLink", label: "Registration link", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "gallery", label: "Gallery", type: "images" },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  },
  {
    key: "memberships",
    singular: "Membership",
    plural: "Memberships",
    titleField: "name",
    subtitleField: "tagline",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "tagline", label: "Tagline", type: "text", half: true },
      { name: "price", label: "Price", type: "text", half: true, placeholder: "e.g. ₹9,999" },
      { name: "period", label: "Period", type: "text", half: true, placeholder: "e.g. per year" },
      { name: "icon", label: "Icon", type: "select", half: true, options: ["briefcase", "rocket", "trending-up", "user-check", "heart-handshake", "users", "handshake", "network", "building"] },
      { name: "order", label: "Display order", type: "number", half: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "benefits", label: "Benefits", type: "list" },
      { name: "isPopular", label: "Popular", type: "checkbox", hint: "Highlight as the most popular plan" }
    ]
  },
  {
    key: "testimonials",
    singular: "Testimonial",
    plural: "Testimonials",
    titleField: "name",
    subtitleField: "company",
    imageField: "image",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "company", label: "Company", type: "text", half: true },
      { name: "role", label: "Role", type: "text", half: true },
      { name: "rating", label: "Rating (1–5)", type: "number", half: true },
      { name: "image", label: "Photo", type: "image" },
      { name: "review", label: "Review", type: "textarea" },
      { name: "videoUrl", label: "Video review URL", type: "text" },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  },
  {
    key: "successStories",
    singular: "Success story",
    plural: "Success Stories",
    titleField: "name",
    subtitleField: "trainingProgram",
    imageField: "image",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "trainingProgram", label: "Training program attended", type: "text", half: true, placeholder: "e.g. Startup Fundamentals" },
      { name: "achievement", label: "Achievement summary", type: "text", placeholder: "e.g. Raised ₹50L in seed funding within 6 months" },
      { name: "image", label: "Photo", type: "image" },
      { name: "video", label: "Success story video URL", type: "text", placeholder: "Paste a YouTube or Vimeo link", hint: "Any YouTube/Vimeo link works — share, watch, or embed URL" },
      { name: "story", label: "Story", type: "textarea" },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  },
  {
    key: "gallery",
    singular: "Gallery item",
    plural: "Gallery",
    titleField: "title",
    subtitleField: "category",
    imageField: "url",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "type", label: "Type", type: "select", half: true, options: ["photo", "video"] },
      { name: "category", label: "Category", type: "text", half: true, placeholder: "e.g. Events" },
      { name: "url", label: "Photo / video URL", type: "image", required: true },
      { name: "thumbnail", label: "Thumbnail (for videos)", type: "image" },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  },
  {
    key: "blogs",
    singular: "Blog post",
    plural: "Blog",
    titleField: "title",
    subtitleField: "category",
    imageField: "banner",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", half: true, hint: "Leave empty to auto-generate" },
      { name: "category", label: "Category", type: "text", half: true },
      { name: "author", label: "Author", type: "text", half: true },
      { name: "publishDate", label: "Publish date", type: "date", half: true },
      { name: "banner", label: "Banner image", type: "image" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "richtext" },
      { name: "tags", label: "Tags", type: "list" },
      { name: "seoTitle", label: "SEO title", type: "text", half: true },
      { name: "seoDescription", label: "SEO description", type: "text", half: true }
    ]
  },
  {
    key: "faqs",
    singular: "FAQ",
    plural: "FAQs",
    titleField: "question",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Answer", type: "textarea" },
      { name: "category", label: "Category", type: "text", half: true },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  },
  {
    key: "team",
    singular: "Team member",
    plural: "Team",
    titleField: "name",
    subtitleField: "role",
    imageField: "image",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "role", label: "Role", type: "text", half: true },
      { name: "image", label: "Photo", type: "image" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "linkedin", label: "LinkedIn URL", type: "text", half: true },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  },
  {
    key: "partners",
    singular: "Partner",
    plural: "Partners & Sponsors",
    titleField: "name",
    subtitleField: "type",
    imageField: "logo",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "type", label: "Type", type: "select", half: true, options: ["Partner", "Sponsor"] },
      { name: "logo", label: "Logo", type: "image" },
      { name: "url", label: "Website URL", type: "text", half: true },
      { name: "address", label: "Address", type: "textarea" },
      { name: "order", label: "Display order", type: "number", half: true }
    ]
  }
];
