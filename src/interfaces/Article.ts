export interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  description: string;
  dialogs: Dialog[];
  participants: Participant[];
  keywords: string[];
  terms: Term[];
}

export interface Participant {
  name: string;
  summary: string;
}

export interface Term {
  term: string;
  definition: string;
}

export interface Dialog {
  order: number;
  speaker: string;
  summary: string;
  response_to: ResponseTo[];
}

export interface ResponseTo {
  dialog_id: number;
  reaction: Reaction;
}

export enum Reaction {
  AGREE = "agree",
  DISAGREE = "disagree",
  NEUTRAL = "neutral",
  QUESTION = "question",
  ANSWER = "answer"
}

export const convertDynamoDBItemToArticle = (item: any): Article => {
  return {
    id: item.id.S,
    title: item.title.S,
    date: item.date.S,
    summary: item.summary.S,
    description: item.description.S,
    category: item.category.S,
    keywords: item.keywords.SS,
    participants: item.participants.L.map((participant: any) => ({
      name: participant.M.name.S,
      summary: participant.M.summary.S,
    })) as Participant[],
    terms: item.terms.L.map((term: any) => ({
      term: term.M.term.S,
      definition: term.M.definition.S,
    })) as Term[],
    dialogs: item.dialogs.L.map((dialog: any) => ({
      order: parseInt(dialog.M.order.N),
      speaker: dialog.M.speaker.S,
      summary: dialog.M.summary.S,
      response_to: dialog.M.response_to.L.map((response: any) => ({
        dialog_id: parseInt(response.M.dialog_id.N),
        reaction: response.M.reaction.S,
      })),
    })),
  };
};