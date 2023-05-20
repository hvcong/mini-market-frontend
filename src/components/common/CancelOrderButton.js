import { RedoOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm } from "antd";
import { useState } from "react";
import billApi from "./../../api/billApi";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshBills } from "../../store/slices/billSlice";
import { useGlobalContext } from "../../store/GlobalContext";
const CancelOrderButton = ({
  open,
  setOpen,
  billId,
  handleCancelOke,
  ...props
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const { emitUpdateOrder } = useGlobalContext();
  // if (!billId) {
  //   setOpen(false);
  //   return;
  // }
  const showPopconfirm = () => {
    setOpen(billId);
  };
  const handleOk = async () => {
    if (!input || (input && input.trim().length == 0)) {
      message.error("Vui lòng thêm lí do hủy đơn hàng!");
      return;
    } else {
      setConfirmLoading(true);

      await cancelOrder(billId, input);
      if (handleCancelOke) {
        handleCancelOke();
      }
      handleCancel();
      setConfirmLoading(false);
    }
  };
  const handleCancel = () => {
    setOpen("");
    setInput("");
    setConfirmLoading(false);
  };

  async function cancelOrder(billId, note) {
    let res = await billApi.addOneReceive({
      note,
      BillId: billId,
      employeeId: account.id,
    });
    if (res.isSuccess) {
      await billApi.updateInfo(billId, {
        employeeId: account.id,
      });
      emitUpdateOrder();
      message.info("Thao tác thành công", 3);
      dispatch(setRefreshBills());
    } else {
      message.info("Có lỗi xảy ra, vui lòng thử lại!", 3);
    }
  }
  return (
    <Popconfirm
      title={
        <Input.TextArea
          style={{
            width: "200px",
          }}
          placeholder="Lí do hủy đơn hàng..."
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
      }
      //   open={open}
      onConfirm={handleOk}
      okButtonProps={{
        loading: confirmLoading,
      }}
      onCancel={handleCancel}
      placement="left"
    >
      <Button danger onClick={showPopconfirm} {...props}>
        Hủy đơn hàng
      </Button>
    </Popconfirm>
  );
};

export default CancelOrderButton;
