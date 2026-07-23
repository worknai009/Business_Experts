import mongoose from "mongoose";

const { Schema, model } = mongoose;

export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withSlug(schema, sourceField) {
  schema.pre("validate", function (next) {
    if (!this.slug && this[sourceField]) {
      this.slug = `${slugify(this[sourceField])}-${Date.now().toString(36).slice(-4)}`;
    }
    next();
  });
}

const opts = { timestamps: true, minimize: false };

/* ---------------------------------- Users ---------------------------------- */

export const User = model(
  "User",
  new Schema(
    {
      name: { type: String, default: "Admin" },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      passwordHash: { type: String, required: true },
      role: { type: String, enum: ["admin", "editor"], default: "admin" }
    },
    opts
  )
);

/* ------------------------------- Site settings ------------------------------ */

const linkSchema = { label: { type: String, default: "" }, url: { type: String, default: "" } };

export const SiteSettings = model(
  "SiteSettings",
  new Schema(
    {
      brand: {
        name: { type: String, default: "" },
        tagline: { type: String, default: "" },
        logo: { type: String, default: "" },
        logoHeight: { type: Number, default: 64 },
        favicon: { type: String, default: "" }
      },
      announcement: {
        enabled: { type: Boolean, default: false },
        text: { type: String, default: "" },
        link: { type: String, default: "" },
        linkLabel: { type: String, default: "" }
      },
      popup: {
        enabled: { type: Boolean, default: false },
        title: { type: String, default: "" },
        message: { type: String, default: "" },
        image: { type: String, default: "" },
        buttonLabel: { type: String, default: "" },
        buttonLink: { type: String, default: "" }
      },
      hero: {
        badge: { type: String, default: "" },
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        image: { type: String, default: "" },
        primaryCta: linkSchema,
        secondaryCta: linkSchema,
        stats: [{ value: String, label: String }]
      },
      sections: [
        {
          key: { type: String, required: true },
          label: { type: String, default: "" },
          enabled: { type: Boolean, default: true }
        }
      ],
      businessStory: {
        enabled: { type: Boolean, default: false },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        video: { type: String, default: "" }
      },
      contact: {
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
        address: { type: String, default: "" },
        mapEmbed: { type: String, default: "" },
        hours: { type: String, default: "" }
      },
      social: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        youtube: { type: String, default: "" }
      },
      footer: {
        about: { type: String, default: "" },
        copyright: { type: String, default: "" },
        links: [linkSchema],
        newsletterEnabled: { type: Boolean, default: true },
        newsletterTitle: { type: String, default: "" },
        newsletterText: { type: String, default: "" }
      },
      seo: {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        keywords: { type: String, default: "" },
        ogImage: { type: String, default: "" }
      },
      theme: {
        primary: { type: String, default: "#059669" },
        dark: { type: String, default: "#0B1220" },
        gray: { type: String, default: "#F4F6FA" }
      }
    },
    opts
  )
);

/* ------------------------------ Content models ------------------------------ */

const base = {
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
};

const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "" },
    features: [String],
    ...base
  },
  opts
);
withSlug(serviceSchema, "title");
export const Service = model("Service", serviceSchema);

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    category: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    gallery: [String],
    video: { type: String, default: "" },
    logo: { type: String, default: "" },
    technologies: [String],
    status: { type: String, enum: ["Planned", "In Progress", "Completed"], default: "Completed" },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    completionDate: { type: Date },
    isFeatured: { type: Boolean, default: false },
    ...base
  },
  opts
);
withSlug(projectSchema, "title");
export const Project = model("Project", projectSchema);

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    category: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    duration: { type: String, default: "" },
    mode: { type: String, enum: ["Online", "Offline", "Hybrid"], default: "Offline" },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "All Levels"], default: "All Levels" },
    priceClass: { type: String, enum: ["Basic", "Standard", "Premium"], default: "Standard" },
    priceLabel: { type: String, default: "" },
    syllabus: [String],
    highlights: [String],
    enrollLink: { type: String, default: "" },
    video: { type: String, default: "" },
    startDate: { type: Date },
    instructorName: { type: String, default: "" },
    instructorRole: { type: String, default: "" },
    instructorBio: { type: String, default: "" },
    instructorImage: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    ...base
  },
  opts
);
withSlug(courseSchema, "title");
export const Course = model("Course", courseSchema);

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, default: "" },
    banner: { type: String, default: "" },
    date: { type: Date },
    time: { type: String, default: "" },
    venue: { type: String, default: "" },
    seats: { type: Number, default: 0 },
    registrationLink: { type: String, default: "" },
    gallery: [String],
    isFeatured: { type: Boolean, default: false },
    ...base
  },
  opts
);
withSlug(eventSchema, "title");
export const Event = model("Event", eventSchema);

export const Membership = model(
  "Membership",
  new Schema(
    {
      name: { type: String, required: true },
      tagline: { type: String, default: "" },
      price: { type: String, default: "" },
      period: { type: String, default: "" },
      description: { type: String, default: "" },
      benefits: [String],
      icon: { type: String, default: "" },
      isPopular: { type: Boolean, default: false },
      ...base
    },
    opts
  )
);

export const Testimonial = model(
  "Testimonial",
  new Schema(
    {
      name: { type: String, required: true },
      company: { type: String, default: "" },
      role: { type: String, default: "" },
      image: { type: String, default: "" },
      rating: { type: Number, min: 1, max: 5, default: 5 },
      review: { type: String, default: "" },
      videoUrl: { type: String, default: "" },
      ...base
    },
    opts
  )
);

export const SuccessStory = model(
  "SuccessStory",
  new Schema(
    {
      name: { type: String, required: true },
      trainingProgram: { type: String, default: "" },
      achievement: { type: String, default: "" },
      story: { type: String, default: "" },
      image: { type: String, default: "" },
      video: { type: String, default: "" },
      ...base
    },
    opts
  )
);

export const GalleryItem = model(
  "GalleryItem",
  new Schema(
    {
      title: { type: String, default: "" },
      type: { type: String, enum: ["photo", "video"], default: "photo" },
      url: { type: String, required: true },
      thumbnail: { type: String, default: "" },
      category: { type: String, default: "" },
      ...base
    },
    opts
  )
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    banner: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    tags: [String],
    category: { type: String, default: "" },
    author: { type: String, default: "" },
    publishDate: { type: Date, default: Date.now },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    ...base
  },
  opts
);
withSlug(blogSchema, "title");
export const BlogPost = model("BlogPost", blogSchema);

export const Faq = model(
  "Faq",
  new Schema(
    {
      question: { type: String, required: true },
      answer: { type: String, default: "" },
      category: { type: String, default: "" },
      ...base
    },
    opts
  )
);

export const TeamMember = model(
  "TeamMember",
  new Schema(
    {
      name: { type: String, required: true },
      role: { type: String, default: "" },
      bio: { type: String, default: "" },
      image: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      ...base
    },
    opts
  )
);

export const Partner = model(
  "Partner",
  new Schema(
    {
      name: { type: String, required: true },
      logo: { type: String, default: "" },
      url: { type: String, default: "" },
      address: { type: String, default: "" },
      type: { type: String, enum: ["Partner", "Sponsor"], default: "Partner" },
      ...base
    },
    opts
  )
);

/* ------------------------------- Interactions ------------------------------- */

export const ContactMessage = model(
  "ContactMessage",
  new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      subject: { type: String, default: "" },
      message: { type: String, default: "" },
      type: { type: String, enum: ["contact", "membership"], default: "contact" },
      membershipType: { type: String, default: "" },
      company: { type: String, default: "" },
      status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
      adminNote: { type: String, default: "" }
    },
    opts
  )
);

export const Subscriber = model(
  "Subscriber",
  new Schema(
    {
      email: { type: String, required: true, unique: true, lowercase: true, trim: true }
    },
    opts
  )
);

export const OtpCode = model(
  "OtpCode",
  new Schema(
    {
      email: { type: String, required: true, lowercase: true, trim: true },
      codeHash: { type: String, required: true },
      expiresAt: { type: Date, required: true },
      attempts: { type: Number, default: 0 },
      consumedAt: { type: Date }
    },
    opts
  )
);
