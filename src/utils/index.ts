import { MapOptions } from "store/modules/Form";

/**
 * 类型
 */
export function switchTypeToMessage(type: string) {
  switch (type) {
    case "number":
      return "必须为数字";
    case "email":
      return "必须为邮箱";
    case "integer":
      return "必须为整数";
    default:
      return "";
  }
}

/**
 * 类型判断
 */
function isMapArray(arr: unknown[]): arr is MapArrayList[] {
  const result = arr.every((item) => {
    if (!Array.isArray(item)) return false;
    const [key, value] = item;
    if (typeof key === "string" && Array.isArray(value)) {
      return true;
    }
    return false;
  });
  return result;
}

/**
 * 转换为Map对象
 */
export function switchToMap(list: unknown): MapList | (string | number)[] {
  if (!Array.isArray(list)) return [];
  if (!isMapArray(list)) return list;
  const newList = new Map<string | number, (string | number)[] | MapList>();
  let { length } = list;
  while (length--) {
    const [key, value] = list[length];
    const val = switchToMap(value);
    newList.set(key, val || value);
  }

  return newList;
}

/**
 * mapl
 */

type MapArrayList = [string | number, (string | number)[] | MapArrayList[]];

export type MapList = Map<string | number, (string | number)[] | MapList>;
