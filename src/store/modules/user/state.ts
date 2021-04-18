import { UserState } from "./interface";

export const userInfo = {
  id: 0,
  userName: "",
  email: "",
  contact: "",
  mobile: "",
  remark: "",
  supplier: "",
  supplierId: "",
};

const initialState: UserState = {
  userInfo,
  uuid: "",
  isLogin: false,
};

export default initialState;
