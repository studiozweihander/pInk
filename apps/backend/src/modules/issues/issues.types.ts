import type { Issue } from "@pink/shared";

export type IssueDB = Issue;

export interface IssueWithRelations extends IssueDB {
  comic?: any;
  idiom?: any;
}