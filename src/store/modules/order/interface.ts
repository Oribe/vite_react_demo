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
