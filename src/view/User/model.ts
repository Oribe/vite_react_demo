import { createSelector } from "reselect";
import { UserInfo, UserState } from "store/modules/user";
import { RootReducer } from "store/store";

const userStore = createSelector<RootReducer, UserState, UserInfo>(
  (store) => store.user,
  (user) => user.userInfo
);

export default userStore;
