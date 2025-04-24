
import { Article, Summary, MiddleSummary, Dialog, Participant, Term } from "@interfaces/Article";

export const parseArticleOutput = (jsonString: string): Article => {
  const parsed = JSON.parse(jsonString);

  return {
    issueID: parsed.issueID,
    title: parsed.title,
    date: parsed.date,
    imageKind: parsed.imageKind,
    session: parsed.session,
    nameOfHouse: parsed.nameOfHouse,
    nameOfMeeting: parsed.nameOfMeeting,
    category: parsed.category,
    description: parsed.description,

    summary: parsed.summary as Summary,
    middle_summary: parsed.middle_summary as MiddleSummary[],
    dialogs: parsed.dialogs as Dialog[],
    participants: parsed.participants as Participant[],
    terms: parsed.terms as Term[],

    keywords: parsed.keywords.map((k: any) => k.keyword),
  };
};
