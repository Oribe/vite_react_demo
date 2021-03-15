/**
 * 处理级联子下拉数据
 */

import { isMap } from "lodash-es";
import { SelectProps } from "store/modules/form";
import { MapList, switchToMap } from "utils/index";
import { produce } from "immer";

const initialOptions = (
  optionsList?: SelectProps,
  associatedValue?: (string | number)[],
  hasAssociatedDataIndex = false
) => {
  let opts: SelectProps | undefined = produce(optionsList, (draft) => draft);
  if (hasAssociatedDataIndex && optionsList) {
    /**
     * 有关联字段
     */
    const mapOptions = switchToMap(optionsList);

    if (isMap(mapOptions) && associatedValue) {
      let val: MapList | (string | number)[] = mapOptions;
      for (let i = 0; i < associatedValue.length; i += 1) {
        val = (isMap(val) && val.get(associatedValue[i])) || [];
      }
      opts =
        (!isMap(val) && val.map((item) => ({ label: item, value: item }))) ||
        [];
    }
  }
  return opts;
};

export default initialOptions;
