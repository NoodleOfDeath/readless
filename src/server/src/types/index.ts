export type SerializableKey = number | string;

export type SerializablePrimative = boolean | number | string;

export type SerializableDict<K extends SerializableKey = SerializableKey, V extends SerializablePrimative = SerializablePrimative> = Record<K, V>;

export type Serializable = SerializablePrimative | SerializableDict;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ValuesOfKeys<T> = T[keyof T];