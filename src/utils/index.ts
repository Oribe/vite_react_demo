import { createAction } from "@reduxjs/toolkit";
import { debounce } from "lodash-es";
import { ComponentFunc, ComponentFuncConfig } from "store/modules/Form";

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

export const formItemNormalize = {
  toUpperCase: (value: string | number) =>
    typeof value === "string" ? value.toUpperCase() : value,
};

/**
 * 将函数配置转换成函数对象？
 */
export function reCreateFunc(
  funcObj: ComponentFuncConfig,
  funcProps = {},
  needDelay = false
) {
  const newFuncObj: ComponentFunc = {};
  if (funcObj) {
    for (const key in funcObj) {
      const value = funcObj[key];
      if (!value) continue; // false跳过
      let f;
      if (typeof value === "boolean") {
        /**
         * 为布尔值
         */
        f = Object.getOwnPropertyDescriptor(funcProps, key)?.value;
      }
      if (typeof value === "string") {
        /**
         * 为字符串
         * 指定了函数名
         */
        f = Object.getOwnPropertyDescriptor(funcProps, value)?.value;
      }
      if (typeof f === "function") {
        if (needDelay) {
          newFuncObj[key] = debounce(f, 500);
        } else {
          newFuncObj[key] = f;
        }
      }
    }
  }
  return newFuncObj;
}

/**
 * 自动识别payload类型
 */
function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

/**
 * 动态创建actions
 */
export const createActinos = <T = unknown>(
  actionTypes: string,
  withPrefix?: string
) => {
  if (withPrefix) {
    return createAction(`${withPrefix}/${actionTypes}`, withPayloadType<T>());
  }
  return createAction(actionTypes, withPayloadType<T>());
};
