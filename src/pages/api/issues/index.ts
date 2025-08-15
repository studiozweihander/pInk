import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { comicId, take = "20", skip = "0" } = req.query;

    const where = comicId ? { comicId: Number(comicId) } : {};

    const [items, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        orderBy: [{ year: "asc" }, { issueNumber: "asc" }],
        take: Number(take),
        skip: Number(skip),
      }),
      prisma.issue.count({ where }),
    ]);

    res.status(200).json({ items, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Internal error" });
  }
}
