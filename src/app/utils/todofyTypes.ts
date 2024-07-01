export type subtaskType = {
  subtaskID: string;
  title: string;
  checked: boolean;
};

export type cardType = {
  cardIndex?: number;
  cardID: string;
  cardTitle: string;
  cardDescription: string;
  cardLabel: string;
  cardSubtasks: subtaskType[];
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
  subtasks: { created: string[]; deleted: string[] };
};
