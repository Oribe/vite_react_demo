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
