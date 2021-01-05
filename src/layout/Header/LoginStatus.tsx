import React, { FC } from "react";
import { Link } from "react-router-dom";
import { UserInfo } from "store/modules/user";

const LoginStatus: FC<Props> = (props: Props) => {
  const { isLogin, userInfo } = props;
  if (!isLogin) {
    return null;
  }
  const { mobile } = userInfo;
  return mobile ? (
    <div>
      <span>用户名：</span>
      <Link to="/user" style={{ color: "#000" }}>
        {mobile}
      </Link>
    </div>
  ) : null;
};

export default LoginStatus;

interface Props {
  userInfo: UserInfo;
  isLogin: boolean;
}
