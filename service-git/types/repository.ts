export type TRepository = {
  owner: { login: string };
  name: string;
  isPriavte: boolean;
  branches?: { name: string }[];
};
