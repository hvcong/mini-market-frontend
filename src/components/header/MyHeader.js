import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import { Link } from "react-router-dom";

const { useToken } = theme;
const MyHeader = () => {
  const { token } = useToken();

  return (
    <Layout>
      <Header style={{ backgroundColor: token.colorPrimaryBg }}></Header>
    </Layout>
  );
};

export default MyHeader;
