
import { Article, Summary, MiddleSummary, Dialog, Participant, Term } from "@interfaces/Article";

export const parseArticleOutput = (jsonString: string, meta: {
  issueID: string,
  title: string,
  date: string,
  imageKind: string,
  session: number,
  nameOfHouse: string,
  nameOfMeeting: string,
  category: string,
  description: string
}): Article => {
  const parsed = JSON.parse(jsonString);

  return {
    ...meta,
    summary: parsed.summary as Summary,
    middle_summary: parsed.middle_summary as MiddleSummary[],
    dialogs: parsed.dialogs as Dialog[],
    participants: parsed.participants as Participant[],
    terms: parsed.terms as Term[],
    keywords: parsed.keywords.map((k: any) => k.keyword),
  };
};