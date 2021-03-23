import { FormState } from "./interface";

const formState: FormState = {
  menu: {
    data: [],
    loading: false,
  },
  form: {
    data: {},
    loading: false,
  },
  manufacturer: {
    data: [],
    loading: false,
  },
  routers: [],
  cutterDataIndexs: {},
};

export default formState;
