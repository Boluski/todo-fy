export type cardType = {
  cardIndex?: number;
  cardID: string;
  cardTitle: string;
  cardDescription: string;
  cardLabel: string;
  alpha: number;
};

export type listType = {
  listID: string;
  listTitle: string;
  isEmpty: boolean;
  cards: cardType[];
};
export type changeLogType = {
  lists: { created: string[]; deleted: string[] };
  cards: { created: string[]; deleted: string[] };
};
