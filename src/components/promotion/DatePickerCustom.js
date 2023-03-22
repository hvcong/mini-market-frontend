import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

const DatePickerCustom = ({ onChangeDate, value, ...props }) => {
  return (
    <RangePicker
      {...props}
      // disabled={[false, true]}
      onChange={(value, strings) => {
        console.log(strings);
        onChangeDate(strings);
      }}
      value={
        value &&
        value.length && [
          value[0] && dayjs(value[0], dateFormat),
          value[1] && dayjs(value[1], dateFormat),
        ]
      }
    />
  );
};

export default DatePickerCustom;
