import crypto from "crypto";
import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { authRouter, requireAuth } from "./auth.js";
import { adminCrudRouter, handle, publicRouter } from "./crud.js";
import {
  BlogPost,
  ContactMessage,
  Course,
  Event,
  Faq,
  GalleryItem,
  Membership,
  Partner,
  Product,
  Project,
  Service,
  SiteSettings,
  Subscriber,
  TeamMember,
  Testimonial
} from "./models.js";
import { uploadsDir } from "./seedMedia.js";

const RESOURCES = {
  services: Service,
  projects: Project,
  products: Product,
  courses: Course,
  events: Event,
  memberships: Membership,
  testimonials: Testimonial,
  gallery: GalleryItem,
  blogs: BlogPost,
  faqs: Faq,
  team: TeamMember,
  partners: Partner
};

async function getSettings() {
  return (await SiteSettings.findOne().lean()) || {};
}

/* --------------------------------- Public API -------------------------------- */

export const publicApi = Router();

publicApi.use("/auth", authRouter);

publicApi.get(
  "/settings",
  handle(async (_request, response) => {
    response.json(await getSettings());
  })
);

// Aggregate payload for the homepage: one request renders everything.
publicApi.get(
  "/home",
  handle(async (_request, response) => {
    const published = { isPublished: { $ne: false } };
    const sorted = { order: 1, createdAt: -1 };
    const [
      settings,
      services,
      projects,
      products,
      courses,
      events,
      memberships,
      testimonials,
      gallery,
      blogs,
      faqs,
      partners
    ] = await Promise.all([
      getSettings(),
      Service.find(published).sort(sorted).lean(),
      Project.find(published).sort({ isFeatured: -1, ...sorted }).limit(6).lean(),
      Product.find(published).sort({ isFeatured: -1, ...sorted }).limit(6).lean(),
      Course.find(published).sort({ isFeatured: -1, ...sorted }).limit(6).lean(),
      Event.find({ ...published, date: { $gte: new Date(Date.now() - 86400000) } })
        .sort({ date: 1 })
        .limit(3)
        .lean(),
      Membership.find(published).sort(sorted).lean(),
      Testimonial.find(published).sort(sorted).lean(),
      GalleryItem.find(published).sort(sorted).limit(8).lean(),
      BlogPost.find(published).sort({ publishDate: -1 }).limit(3).lean(),
      Faq.find(published).sort(sorted).lean(),
      Partner.find(published).sort(sorted).lean()
    ]);
    response.json({
      settings,
      services,
      projects,
      products,
      courses,
      events,
      memberships,
      testimonials,
      gallery,
      blogs,
      faqs,
      partners
    });
  })
);

publicApi.use("/services", publicRouter(Service));
publicApi.use("/projects", publicRouter(Project));
publicApi.use("/products", publicRouter(Product));
publicApi.use("/courses", publicRouter(Course));
publicApi.use(
  "/events",
  publicRouter(Event, {
    extraFilter: (request) =>
      request.query.upcoming === "1" ? { date: { $gte: new Date(Date.now() - 86400000) } } : {},
    sort: { date: 1 }
  })
);
publicApi.use("/memberships", publicRouter(Membership));
publicApi.use("/testimonials", publicRouter(Testimonial));
publicApi.use("/gallery", publicRouter(GalleryItem));
publicApi.use("/blogs", publicRouter(BlogPost, { sort: { publishDate: -1 } }));
publicApi.use("/faqs", publicRouter(Faq));
publicApi.use("/team", publicRouter(TeamMember));
publicApi.use("/partners", publicRouter(Partner));

publicApi.post(
  "/contact",
  handle(async (request, response) => {
    const { name, email, phone, subject, message, type, membershipType, company } = request.body || {};
    if (!name?.trim() || (!email?.trim() && !phone?.trim())) {
      response.status(400).json({ ok: false, error: "Name and an email or phone number are required." });
      return;
    }
    await ContactMessage.create({
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      subject: subject?.trim() || "",
      message: message?.trim() || "",
      type: type === "membership" ? "membership" : "contact",
      membershipType: membershipType?.trim() || "",
      company: company?.trim() || ""
    });
    response.status(201).json({ ok: true });
  })
);

publicApi.post(
  "/newsletter",
  handle(async (request, response) => {
    const email = String(request.body?.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      response.status(400).json({ ok: false, error: "A valid email is required." });
      return;
    }
    await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
    response.status(201).json({ ok: true });
  })
);

/* --------------------------------- Admin API --------------------------------- */

export const adminApi = Router();
adminApi.use(requireAuth);

for (const [name, Model] of Object.entries(RESOURCES)) {
  adminApi.use(
    `/${name}`,
    adminCrudRouter(Model, name === "blogs" ? { sort: { publishDate: -1 } } : {})
  );
}

adminApi.get(
  "/settings",
  handle(async (_request, response) => {
    response.json(await getSettings());
  })
);

adminApi.put(
  "/settings",
  handle(async (request, response) => {
    const { _id, createdAt, updatedAt, __v, ...payload } = request.body || {};
    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    response.json(settings);
  })
);

adminApi.get(
  "/messages",
  handle(async (_request, response) => {
    response.json(await ContactMessage.find().sort({ createdAt: -1 }).lean());
  })
);

adminApi.patch(
  "/messages/:id",
  handle(async (request, response) => {
    const update = {};
    if (["new", "contacted", "closed"].includes(request.body?.status)) update.status = request.body.status;
    if (typeof request.body?.adminNote === "string") update.adminNote = request.body.adminNote.trim();
    const doc = await ContactMessage.findByIdAndUpdate(request.params.id, update, { new: true }).lean();
    if (!doc) {
      response.status(404).json({ ok: false, error: "Not found." });
      return;
    }
    response.json(doc);
  })
);

adminApi.delete(
  "/messages/:id",
  handle(async (request, response) => {
    await ContactMessage.findByIdAndDelete(request.params.id);
    response.json({ ok: true });
  })
);

adminApi.get(
  "/subscribers",
  handle(async (_request, response) => {
    response.json(await Subscriber.find().sort({ createdAt: -1 }).lean());
  })
);

adminApi.delete(
  "/subscribers/:id",
  handle(async (request, response) => {
    await Subscriber.findByIdAndDelete(request.params.id);
    response.json({ ok: true });
  })
);

adminApi.get(
  "/stats",
  handle(async (_request, response) => {
    const since = new Date();
    since.setMonth(since.getMonth() - 5);
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const [
      members,
      investors,
      projects,
      products,
      events,
      services,
      blogs,
      testimonials,
      subscribers,
      newMessages,
      recentMessages,
      monthlyRaw
    ] = await Promise.all([
      ContactMessage.countDocuments({ type: "membership" }),
      ContactMessage.countDocuments({ type: "membership", membershipType: /investor/i }),
      Project.countDocuments(),
      Product.countDocuments(),
      Event.countDocuments(),
      Service.countDocuments(),
      BlogPost.countDocuments(),
      Testimonial.countDocuments(),
      Subscriber.countDocuments(),
      ContactMessage.countDocuments({ status: "new" }),
      ContactMessage.find().sort({ createdAt: -1 }).limit(8).lean(),
      ContactMessage.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
              type: "$type"
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const months = [];
    const cursor = new Date(since);
    for (let index = 0; index < 6; index += 1) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const label = cursor.toLocaleString("en", { month: "short" });
      const find = (type) =>
        monthlyRaw.find((row) => row._id.y === y && row._id.m === m && row._id.type === type)?.count || 0;
      months.push({ label, contact: find("contact"), membership: find("membership") });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    response.json({
      counts: { members, investors, projects, products, events, services, blogs, testimonials, subscribers, newMessages },
      recentMessages,
      monthly: months
    });
  })
);

/* ----------------------------------- Uploads ---------------------------------- */

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

adminApi.post("/upload", upload.single("file"), async (request, response) => {
  if (!request.file) {
    response.status(400).json({ ok: false, error: "No file uploaded (field name: file)." });
    return;
  }

  try {
    if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
      const { v2: cloudinary } = await import("cloudinary");
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        });
      }
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "business-experts", resource_type: "auto" }, (error, data) =>
            error ? reject(error) : resolve(data)
          )
          .end(request.file.buffer);
      });
      response.status(201).json({ ok: true, url: result.secure_url, provider: "cloudinary" });
      return;
    }

    // Local fallback when Cloudinary is not configured.
    const ext = path.extname(request.file.originalname || "").toLowerCase() || ".bin";
    const safeExt = /^\.(png|jpe?g|gif|webp|svg|mp4|webm|pdf|avif)$/.test(ext) ? ext : ".bin";
    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${safeExt}`;
    fs.writeFileSync(path.join(uploadsDir, name), request.file.buffer);
    response.status(201).json({ ok: true, url: `/api/media/uploads/${name}`, provider: "local" });
  } catch (error) {
    response.status(500).json({ ok: false, error: `Upload failed: ${error.message}` });
  }
});
