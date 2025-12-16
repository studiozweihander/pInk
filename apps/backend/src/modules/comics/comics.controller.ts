import { Elysia, t } from "elysia";
import { ComicsService } from "@comics/comics.service";

export const createComicsController = () => {
  const service = new ComicsService();

  return new Elysia({ prefix: "/api/comics", name: "comics" })
    .get(
      "/search",
      async ({ query }) => {
        const limit = query.limit
          ? Math.min(Math.max(query.limit, 1), 100)
          : 100;
        const offset = query.offset ? Math.max(query.offset, 0) : 0;

        const result = await service.searchComics(
          {
            search: query.search,
            publisherId: query.publisherId,
            idiomId: query.idiomId,
            year: query.year,
          },
          { limit, offset }
        );

        return {
          success: true,
          data: result.comics,
          count: result.comics.length,
          total: result.total,
          hasMore: result.hasMore,
          message: "Comics search completed",
        };
      },
      {
        query: t.Object({
          search: t.Optional(t.String()),
          publisherId: t.Optional(t.Numeric()),
          idiomId: t.Optional(t.Numeric()),
          year: t.Optional(t.Numeric()),
          limit: t.Optional(t.Numeric()),
          offset: t.Optional(t.Numeric()),
        }),
        response: t.Object({
          success: t.Boolean(),
          data: t.Array(
            t.Object({
              id: t.Number(),
              title: t.String(),
              year: t.Number(),
              cover: t.String(),
              idiomId: t.Number(),
              publisherId: t.Number(),
              issues: t.Number(),
            })
          ),
          count: t.Number(),
          total: t.Number(),
          hasMore: t.Boolean(),
          message: t.String(),
        }),
        detail: {
          tags: ["Comics"],
          summary: "Search comics",
          description: "Search comics by title, publisher, language, or year",
          parameters: [
            {
              name: "search",
              in: "query",
              description: "Search term for comic title",
              schema: { type: "string" },
            },
            {
              name: "publisherId",
              in: "query",
              description: "Filter by publisher ID",
              schema: { type: "integer" },
            },
            {
              name: "idiomId",
              in: "query",
              description: "Filter by language/idiom ID",
              schema: { type: "integer" },
            },
            {
              name: "year",
              in: "query",
              description: "Filter by publication year",
              schema: { type: "integer" },
            },
            {
              name: "limit",
              in: "query",
              description: "Number of items to return (1-100)",
              schema: { type: "integer", default: 100 },
            },
            {
              name: "offset",
              in: "query",
              description: "Number of items to skip",
              schema: { type: "integer", default: 0 },
            },
          ],
        },
      }
    )
    .get(
      "/",
      async ({ query }) => {
        const limit = query.limit
          ? Math.min(Math.max(query.limit, 1), 100)
          : 100;
        const offset = query.offset ? Math.max(query.offset, 0) : 0;

        const result = await service.getAllComics({ limit, offset });

        return {
          success: true,
          data: result.comics,
          count: result.comics.length,
          total: result.total,
          hasMore: result.hasMore,
          message: "Comics retrieved successfully",
        };
      },
      {
        query: t.Object({
          limit: t.Optional(t.Numeric()),
          offset: t.Optional(t.Numeric()),
        }),
        response: t.Object({
          success: t.Boolean(),
          data: t.Array(
            t.Object({
              id: t.Number(),
              title: t.String(),
              year: t.Number(),
              cover: t.String(),
              idiomId: t.Number(),
              publisherId: t.Number(),
              issues: t.Number(),
            })
          ),
          count: t.Number(),
          total: t.Number(),
          hasMore: t.Boolean(),
          message: t.String(),
        }),
        detail: {
          tags: ["Comics"],
          summary: "List all comics",
          description: "Returns a paginated list of all comics in the database",
          parameters: [
            {
              name: "limit",
              in: "query",
              description: "Number of items to return (1-100)",
              schema: { type: "integer", default: 100 },
            },
            {
              name: "offset",
              in: "query",
              description: "Number of items to skip",
              schema: { type: "integer", default: 0 },
            },
          ],
        },
      }
    )
    .get(
      "/:id",
      async ({ params }) => {
        const comic = await service.getComicById(params.id);

        return {
          success: true,
          data: comic,
          message: "Comic retrieved successfully",
        };
      },
      {
        params: t.Object({ id: t.Numeric() }),
        response: t.Object({
          success: t.Boolean(),
          data: t.Object({
            id: t.Number(),
            title: t.String(),
            year: t.Number(),
            cover: t.String(),
            idiomId: t.Number(),
            publisherId: t.Number(),
            issues: t.Number(),
            idiom: t.Optional(
              t.Object({
                id: t.Number(),
                name: t.String(),
              })
            ),
            publisher: t.Optional(
              t.Object({
                id: t.Number(),
                name: t.String(),
              })
            ),
            authors: t.Optional(
              t.Array(
                t.Object({
                  id: t.Number(),
                  name: t.String(),
                })
              )
            ),
          }),
          message: t.String(),
        }),
        detail: {
          tags: ["Comics"],
          summary: "Get comic by ID",
          description:
            "Returns a specific comic with its details including authors",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Comic ID",
              schema: { type: "integer" },
            },
          ],
        },
      }
    );
};
