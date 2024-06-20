interface StorageItem {
  expire?: string;
  data: any;
}

const PREFIX = 'skeleton-ge_';

export function set(key: string, value: StorageItem, expire?: string) {
  const data = { expire, data: value };
  localStorage.setItem(PREFIX + key, JSON.stringify(data));
}

export function get(key: string) {
  const storage = localStorage.getItem(PREFIX + key) || '';

  let data;
  try {
    data = JSON.parse(storage) as StorageItem;
  } catch (error) {
    return null;
  }

  return data.data;
}

export function remove(key: string) {
  localStorage.removeItem(PREFIX + key);
}
