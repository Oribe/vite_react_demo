import React from "react";
import { FC } from "react";

const User: FC = (props) => {
  console.log("用户中心", props);

  return (
    <>
      <h1>Contact</h1>
      <p>
        Aliquam iaculis a nisi sed ornare. Sed venenatis tellus vel consequat
        congue. In bibendum vestibulum orci et feugiat.
      </p>
    </>
  );
};

export default User;
