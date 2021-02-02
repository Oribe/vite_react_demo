/**
 * 表单内容
 */

import React, { FC } from "react";
import { FormItem } from "store/modules/Form";

const FormBody: FC<Props> = () => {
  return <div>表单主体内容</div>;
};

export default FormBody;

interface Props {
  body: FormItem[];
}
