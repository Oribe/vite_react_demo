/**
 * 订单State
 */
export interface OrderState {
  orderList: Cutter[];
}

/**
 * 刀具信息
 */
export interface Cutter {
  orderNumber: string;
  category: number;
  subCategory: number;
  [key: string]: unknown;
}

/**
 * 提交的订单信息中的刀具信息
 */
interface OrderItemsType {
  orderNumber: string;
  category: number;
  subCategory: number;
  manufacturer: string;
  quantity: number;
}

export interface SubmitOrderType {
  orderNo: string;
  /**
   * 刀具种类数量
   */
  modelNumber: number;
  /**
   * 所有刀具数量的总和
   */
  quantity: number;
  supplier: string;
  orders: OrderItemsType[];
}
