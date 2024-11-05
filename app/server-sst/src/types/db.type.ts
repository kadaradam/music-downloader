export type WithoutId<T> = Omit<T, 'id'>;
export type ItemProps<T> = Partial<Record<keyof T, number | string | boolean>>;
export type NumberItemProp<T> = Extract<
  keyof T,
  { [K in keyof T]: T[K] extends number ? K : never }[keyof T]
>;
