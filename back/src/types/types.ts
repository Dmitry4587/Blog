export interface IFindParams {
  tags?: string;
  title?: {
    $regex: string;
    $options: string;
  };
  user?: { _id: string };
}
