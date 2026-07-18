import { Router } from "express";

const DEFAULT_SORT = { order: 1, createdAt: -1 };

function handle(fn) {
  return async (request, response) => {
    try {
      await fn(request, response);
    } catch (error) {
      const status = error.name === "ValidationError" || error.name === "CastError" ? 400 : 500;
      response.status(status).json({ ok: false, error: error.message });
    }
  };
}

/** Public read-only router: published items only, with optional filters. */
export function publicRouter(Model, { slugField = "slug", sort = DEFAULT_SORT, extraFilter } = {}) {
  const router = Router();

  router.get(
    "/",
    handle(async (request, response) => {
      const filter = { isPublished: { $ne: false }, ...(extraFilter?.(request) || {}) };
      if (request.query.featured === "1") filter.isFeatured = true;
      if (request.query.category) filter.category = request.query.category;
      let query = Model.find(filter).sort(sort);
      if (request.query.limit) query = query.limit(Number(request.query.limit) || 0);
      response.json(await query.lean());
    })
  );

  router.get(
    "/:slug",
    handle(async (request, response) => {
      const doc = await Model.findOne({
        [slugField]: request.params.slug,
        isPublished: { $ne: false }
      }).lean();
      if (!doc) {
        response.status(404).json({ ok: false, error: "Not found." });
        return;
      }
      response.json(doc);
    })
  );

  return router;
}

/** Full CRUD router for the admin panel. */
export function adminCrudRouter(Model, { sort = DEFAULT_SORT } = {}) {
  const router = Router();

  router.get(
    "/",
    handle(async (_request, response) => {
      response.json(await Model.find().sort(sort).lean());
    })
  );

  router.post(
    "/",
    handle(async (request, response) => {
      response.status(201).json(await Model.create(request.body || {}));
    })
  );

  router.put(
    "/:id",
    handle(async (request, response) => {
      const { _id, createdAt, updatedAt, __v, ...payload } = request.body || {};
      const doc = await Model.findByIdAndUpdate(
        request.params.id,
        { $set: payload },
        { new: true, runValidators: true }
      ).lean();
      if (!doc) {
        response.status(404).json({ ok: false, error: "Not found." });
        return;
      }
      response.json(doc);
    })
  );

  router.delete(
    "/:id",
    handle(async (request, response) => {
      await Model.findByIdAndDelete(request.params.id);
      response.json({ ok: true });
    })
  );

  router.patch(
    "/reorder",
    handle(async (request, response) => {
      const items = Array.isArray(request.body?.items) ? request.body.items : [];
      if (items.length) {
        await Model.bulkWrite(
          items.map(({ id, order }) => ({
            updateOne: { filter: { _id: id }, update: { $set: { order: Number(order) || 0 } } }
          }))
        );
      }
      response.json({ ok: true });
    })
  );

  return router;
}

export { handle };
