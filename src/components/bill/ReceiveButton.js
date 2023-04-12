import { RedoOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm } from "antd";
import { useState } from "react";
import billApi from "./../../api/billApi";
import { useDispatch } from "react-redux";
import { setRefreshBills } from "../../store/slices/billSlice";
const ReceiveButton = ({
  open,
  setOpen,
  billId,
  handleReceiveOke,
  ...props
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  // if (!billId) {
  //   setOpen(false);
  //   return;
  // }
  const showPopconfirm = () => {
    console.log(billId);
    setOpen(billId);
  };
  const handleOk = async () => {
    if (!input || (input && input.trim().length == 0)) {
      message.error("Vui lòng thêm lí do trả hàng!");
      return;
    } else {
      setConfirmLoading(true);

      let res = await billApi.addOneReceive({
        note: input,
        BillId: billId,
      });

      if (res.isSuccess) {
        message.info("Thao tác thành công");
        dispatch(setRefreshBills());
        if (handleReceiveOke) {
          handleReceiveOke();
        }
        handleCancel();
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
      setConfirmLoading(false);
    }
  };
  const handleCancel = () => {
    setOpen("");
    setInput("");
    setConfirmLoading(false);
  };
  return (
    <Popconfirm
      title={
        <Input.TextArea
          style={{
            width: "200px",
          }}
          placeholder="Ghi chú trả hàng ..."
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
      }
      open={open}
      onConfirm={handleOk}
      okButtonProps={{
        loading: confirmLoading,
      }}
      onCancel={handleCancel}
      placement="left"
    >
      <Button
        danger
        icon={<RedoOutlined />}
        onClick={showPopconfirm}
        {...props}
      >
        Trả hàng
      </Button>
    </Popconfirm>
  );
};
export default ReceiveButton;
