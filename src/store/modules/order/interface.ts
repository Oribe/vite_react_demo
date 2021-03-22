/**
 * 订单State
 */
export interface OrderState {
  orderList: Cutter[];
  history: {
    loading: boolean;
    data: HistoryOrder[];
  };
}

export type HistoryOrder = SubmitOrderType;

/**
 * 刀具信息
 */
export interface Cutter {
  orderNumber: string;
  category: number;
  subCategory: number;
  [key: string]: string | number;
}

/**
 * 提交的订单信息中的刀具信息
 */
export interface OrderItemsType {
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
  createAt?: string;
}

export interface HistoryParamType {
  startTime?: string;
  endTime?: string;
}
