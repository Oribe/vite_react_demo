/**
 * 订单State
 */
export interface OrderState {
  orderListLoading: boolean;
  orderList: Cutter[];
  history: {
    loading: boolean;
    data: HistoryOrder[];
  };
  uncompleted: {
    loading: boolean;
    data: UncompletedOrder[];
  };
}

export type HistoryOrder = SubmitOrderType;
export type UncompletedOrder = SubmitOrderType;

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
export interface OrderItemsType extends Cutter {
  manufacturer: string;
  quantity: number;
  [key: string]: string | number;
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

export interface TimeRangeParam {
  startTime?: string;
  endTime?: string;
}
