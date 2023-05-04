import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import { useState } from "react";

const UploadImageProduct = ({ fileList = [], setFileList, disabled }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => {
    let _newList = newFileList.map((file) => {
      if (file.response) {
        if (!file.response.isSuccess) {
          return {
            ...file,
            status: "error",
            error: {
              message: "Tên file không được chứa kí tự khoảng trắng!",
            },
          };
        } else {
          return {
            ...file,
            url: file.response.uri,
            status: "done",
          };
        }
      }
      return file;
    });

    setFileList(_newList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải lên
      </div>
    </div>
  );
  return (
    <>
      <Upload
        action="http://localhost:3000/images/post"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        maxCount={5}
        accept=".png,.jpg,.jpeg"
        disabled={disabled}
      >
        {fileList.length >= 5 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};
export default UploadImageProduct;
