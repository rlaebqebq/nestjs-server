export type ReadonlyEnum<K extends string, V> = Readonly<Record<K, V>>;

export interface IPaginationParams {
  search?: string;
  view?: number;
  pageParam?: number;
}

export interface IPagination<T> {
  totalCount: number;
  totalPage: number;
  pageParam: number;
  view: number;
  list: T;
}
