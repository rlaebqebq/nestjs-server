export type ReadonlyEnum<K extends string, V> = Readonly<Record<K, V>>;

export interface IPaginationParams {
  search?: string;
  view?: number;
  page?: number;
}

export interface IPagination<T> {
  totalCount: number;
  totalPage: number;
  page: number;
  view: number;
  list: T;
}
