import { FormInstance } from "antd";
import { createContext } from "react";
import { Cutter } from "store/modules/order";

const EditableContext = createContext<FormInstance<Cutter> | null>(null);

export default EditableContext;
