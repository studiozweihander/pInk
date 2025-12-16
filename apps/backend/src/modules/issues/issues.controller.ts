import { Elysia, t } from "elysia";
import { IssuesService } from "@issues/issues.service";

export const createIssuesController = () => {
  const service = new IssuesService();

  return new Elysia({ prefix: "/api/issues", name: "issues" })
    .get(
      "/",
      async ({ query }) => {
        const limit = query.limit
          ? Math.min(Math.max(query.limit, 1), 100)
          : 100;
        const offset = query.offset ? Math.max(query.offset, 0) : 0;

        if (query.comicId) {
          const result = await service.getIssuesByComic(query.comicId, {
            limit,
            offset,
          });

          return {
            success: true,
            data: result.issues,
            count: result.issues.length,
            total: result.total,
            hasMore: result.hasMore,
            message: "Issues retrieved successfully",
          };
        }

        const result = await service.getAllIssues({ limit, offset });

        return {
          success: true,
          data: result.issues,
          count: result.issues.length,
          total: result.total,
          hasMore: result.hasMore,
          message: "Issues retrieved successfully",
        };
      },
      {
        query: t.Object({
          comicId: t.Optional(t.Numeric()),
          limit: t.Optional(t.Numeric()),
          offset: t.Optional(t.Numeric()),
        }),
        response: t.Object({
          success: t.Boolean(),
          data: t.Array(
            t.Object({
              id: t.Number(),
              title: t.String(),
              issueNumber: t.Number(),
              year: t.Number(),
              size: t.String(),
              series: t.String(),
              genres: t.Nullable(t.String()),
              link: t.String(),
              cover: t.String(),
              synopsis: t.Nullable(t.String()),
              comicId: t.Number(),
              idiomId: t.Number(),
              credito: t.Nullable(t.String()),
              creditoLink: t.Nullable(t.String()),
            })
          ),
          count: t.Number(),
          total: t.Number(),
          hasMore: t.Boolean(),
          message: t.String(),
        }),
        detail: {
          tags: ["Issues"],
          summary: "List issues",
          description:
            "Returns a paginated list of all issues or issues filtered by comic",
          parameters: [
            {
              name: "comicId",
              in: "query",
              description: "Filter by comic ID",
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
      "/:id",
      async ({ params }) => {
        const issue = await service.getIssueById(params.id);

        return {
          success: true,
          data: issue,
          message: "Issue retrieved successfully",
        };
      },
      {
        params: t.Object({ id: t.Numeric() }),
        response: t.Object({
          success: t.Boolean(),
          data: t.Object({
            id: t.Number(),
            title: t.String(),
            issueNumber: t.Number(),
            year: t.Number(),
            size: t.String(),
            series: t.String(),
            genres: t.Nullable(t.String()),
            link: t.String(),
            cover: t.String(),
            synopsis: t.Nullable(t.String()),
            comicId: t.Number(),
            idiomId: t.Number(),
            credito: t.Nullable(t.String()),
            creditoLink: t.Nullable(t.String()),
          }),
          message: t.String(),
        }),
        detail: {
          tags: ["Issues"],
          summary: "Get issue by ID",
          description: "Returns a specific issue with its details",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Issue ID",
              schema: { type: "integer" },
            },
          ],
        },
      }
    );
};
