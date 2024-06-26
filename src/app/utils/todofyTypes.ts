export type cardType = {
  cardID: string;
  cardTitle: string;
  cardDescription: string;
  alpha: number;
};

export type listType = {
  listID: string;
  listTitle: string;
  isEmpty: boolean;
  cards: cardType[];
};
