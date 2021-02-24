export interface LoginBody extends Record<string, unknown> {
  username: string;
  password: string;
}

export interface UserInfo {
  contact: string;
  email: string;
  id: number;
  mobile: string;
  remark: string;
  supplier: string;
  supplierId: string;
  userName: string;
}

export interface UserState {
  userInfo: UserInfo;
  uuid: string;
  isLogin: boolean;
}

export type LoginRespData = UserState;
