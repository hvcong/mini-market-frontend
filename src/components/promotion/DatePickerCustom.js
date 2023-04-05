import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import { sqlToAntd } from "../../utils";
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

const DatePickerCustom = ({ onChangeDate, value, ...props }) => {
  return (
    <RangePicker
      {...props}
      // disabled={[false, true]}
      onChange={(value, strings) => {
        if (strings && strings.length > 1) {
          onChangeDate(strings);
        }
      }}
      value={
        value &&
        value.length && [
          value[0] && sqlToAntd(value[0]),
          value[1] && sqlToAntd(value[1]),
        ]
      }
    />
  );
};

export default DatePickerCustom;
