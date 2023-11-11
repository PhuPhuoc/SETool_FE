import {
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Form,
  Input,
  Menu,
  Row,
  Typography,
} from "antd";
import { useState } from "react";
import { handleDangXuat } from "../../config/AxiosInstance";
import { useNavigate } from "react-router";
import { addImage, getImage } from "../../helper/uploadImage";
const { Text } = Typography;

const UserAvatar = () => {
  const nav = useNavigate();
  const username_current = sessionStorage.getItem("name_current");
  const id_current = sessionStorage.getItem("id_current");
  const email_current = sessionStorage.getItem("email_current");
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isChangeUserInfoVisible, setIsChangeUserInfoVisible] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const showChangePasswordDrawer = () => {
    setIsChangePasswordVisible(true);
  };
  const showChangeUserInfoDrawer = () => {
    setIsChangeUserInfoVisible(true);
    getImageEdit();
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<LockOutlined />}
        onClick={showChangePasswordDrawer}
      >
        Change password
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<UserSwitchOutlined />}
        onClick={showChangeUserInfoDrawer}
      >
        User information
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<LogoutOutlined />}
        onClick={() => {
          handleDangXuat();
          nav("/");
        }}
      >
        Log out
      </Menu.Item>
    </Menu>
  );

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const submitChangePassword = (values) => {
    const data = { ...values };
    console.log(data);
    // if (data) {
    //   dispatch(changePassword(data))
    //     .unwrap()
    //     .then((result) => {
    //       message.success(result);
    //       setIsChangePasswordVisible(false);
    //       form.resetFields();
    //     })
    //     .catch((error) => {
    //       message.error(error);
    //     });
    // }
  };

  const changePasswordContent = (
    <Form {...layout} form={form} onFinish={submitChangePassword}>
      <Form.Item
        label={<Text>Current Password </Text>}
        name="password"
        rules={[
          {
            required: true,
            message: "Current Password must not be a blank",
          },
        ]}
      >
        <Input.Password allowClear placeholder="Input Current Password" />
      </Form.Item>
      <Form.Item
        label={<Text>New Password </Text>}
        name="newPassword"
        rules={[
          {
            required: true,
            message: "New Password must not be a blank",
          },
          {
            pattern:
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{6,}$/,
            message:
              "A new password must have at least 6 characters, one uppercase letter, one digit, and one special character.",
          },
        ]}
      >
        <Input.Password allowClear placeholder="Input New Password" />
      </Form.Item>
      <Form.Item
        label={<Text>Confirm new password </Text>}
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: "Confirm new password must not be blank",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  "The password you just entered does not match the old password."
                )
              );
            },
          }),
        ]}
      >
        <Input.Password allowClear placeholder="Input new password confirm." />
      </Form.Item>
      <Button block type="primary" htmlType="submit">
        Đổi mật khẩu
      </Button>
    </Form>
  );

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file && id_current) {
      try {
        await addImage(file, id_current);
        console.log("Image uploaded successfully!");
        setIsChangeUserInfoVisible(false);
        form.resetFields();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.error("Please select a file and provide an ID.");
    }
  };

  const getImageEdit = async () => {
    if (id_current) {
      try {
        const url = await getImage(id_current);
        setImageUrl(url);
      } catch (error) {
        console.error("Error getting image:", error);
      }
    } else {
      console.error("Please provide an ID to get the image.");
    }
  };

  const changeUserInfoContent = (
    <Form {...layout} form={form1}>
      <Form.Item wrapperCol={24} name="avatar" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            src={<img src={imageUrl} style={{ margin: 0 }}></img>}
            size={140}
          ></Avatar>
        </div>
      </Form.Item>
      <Form.Item wrapperCol={24} name="imgLink" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{ marginLeft: 110 }}
          />
        </div>
      </Form.Item>
      <Form.Item label={<Text>Username </Text>} name="username">
        <Text>{username_current}</Text>
      </Form.Item>
      <Form.Item label={<Text>Email </Text>} name="email">
        <Text>{email_current}</Text>
      </Form.Item>
      <Row gutter={24} style={{ width: "100%" }}>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button
            className="custom-btn-watch-report"
            htmlType="submit"
            icon={<EditOutlined></EditOutlined>}
            onClick={handleUpload}
          >
            Edit
          </Button>
        </Col>
      </Row>
    </Form>
  );

  const closeChangePasswordDrawer = () => {
    setIsChangePasswordVisible(false);
    form.resetFields();
  };

  const closeChangeUserInfoDrawer = () => {
    setIsChangeUserInfoVisible(false);
    form1.resetFields();
  };

  return (
    <div style={{ marginRight: 50 }}>
      <span>
        <Avatar
          src={<img src={imageUrl} style={{ margin: 0 }}></img>}
          style={{
            marginRight: "6px",
            marginBottom: 4,
          }}
        >
          {username_current && username_current.charAt(0)}
        </Avatar>
        <Dropdown
          arrow={{
            pointAtCenter: true,
          }}
          overlay={menu}
          placement="bottom"
        >
          <span>
            <Text style={{ fontWeight: "bold", cursor: "pointer" }}>
              {username_current && username_current}
            </Text>
          </span>
        </Dropdown>
      </span>
      <Drawer
        title="Change password"
        placement="right"
        closable={true}
        onClose={closeChangePasswordDrawer}
        visible={isChangePasswordVisible}
        width={650}
      >
        {changePasswordContent}
      </Drawer>
      <Drawer
        title="User information"
        placement="right"
        closable={true}
        onClose={closeChangeUserInfoDrawer}
        visible={isChangeUserInfoVisible}
        width={650}
      >
        {changeUserInfoContent}
      </Drawer>
    </div>
  );
};

export default UserAvatar;
