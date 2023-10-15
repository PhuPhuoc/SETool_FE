import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Typography,
  Input,
  Tag,
  DatePicker,
  message,
} from "antd";
import { useState } from "react";
const { Text } = Typography;
import PropTypes from "prop-types";
import {
  ArrowDownOutlined,
  EditOutlined,
  InboxOutlined,
  IssuesCloseOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import dayjs from "dayjs";
const EditBacklogs = ({ onClose, form }) => {
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const props = {
    name: "file",
    multiple: true,
    accept: ".png,.jpg",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`, 1.5);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`, 1.5);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleFormSubmit = (values) => {
    const data = { ...values };
    console.log("backlogs add: ", data);
    // if (!isEmployee) {
    //   data.staffID = parseInt(staffID_current);
    // }
    // if (data) {
    //   dispatch(taoDonTangCa(data))
    //     .unwrap()
    //     .then((result) => {
    //       message.success(result);
    //       form.resetFields();
    //       onClose();
    //     })
    //     .catch((error) => {
    //       message.error(error);
    //     });
    // }
  };

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  const handleCancel = () => {
    form.resetFields();
    setIsSuccessMessageVisible(false);
    onClose();
  };

  return (
    <>
      <Form
        {...layout}
        form={form}
        onFinish={handleFormSubmit}
        style={{ maxHeight: 598, marginTop: "10px", overflow: "auto" }}
      >
        <Form.Item
          label={<Text>Project name</Text>}
          name="name"
          style={{ marginRight: 10 }}
          rules={[
            {
              required: true,
              message: "Project name must not be a blank",
            },
          ]}
        >
          <Input placeholder="Input project name" allowClear></Input>
        </Form.Item>
        <Form.Item
          label={<Text>Description</Text>}
          name="description"
          style={{ marginRight: 10 }}
          rules={[
            {
              required: true,
              message: "Description must not be a blank",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Input description"
            allowClear
          ></Input.TextArea>
        </Form.Item>
        <Form.Item
          label={<Text>Task type</Text>}
          name="taskType"
          style={{ marginRight: 10 }}
          rules={[
            {
              required: true,
              message: "Task Type must not be a blank",
            },
          ]}
        >
          <Select
            style={{ width: "60%" }}
            placeholder="Choose task type"
            options={[
              {
                value: 0,
                label: <Text>DEV</Text>,
              },
              {
                value: 1,
                label: <Text>QA</Text>,
              },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item
          label={<Text>Start date</Text>}
          name="startDate"
          style={{ marginRight: 10 }}
          rules={[
            {
              required: true,
              message: "Please select a start date",
            },
          ]}
        >
          <DatePicker
            placeholder="Select start date"
            style={{ width: "60%" }}
            disabledDate={(current) => {
              const currentDate = dayjs(current);
              const today = dayjs();
              return currentDate.isBefore(today, "day");
            }}
            format="DD/MM/YYYY"
          ></DatePicker>
        </Form.Item>
        <Form.Item
          label={<Text>End date</Text>}
          name="endDate"
          style={{ marginRight: 10 }}
          rules={[
            {
              required: true,
              message: "Please select an end date",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue("startDate");
                if (!startDate || !value) {
                  return Promise.resolve();
                }
                const oneWeekLater = dayjs(startDate).add(1, "week");
                if (dayjs(value).isAfter(oneWeekLater, "day")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "End date must be at least 1 week after start date"
                );
              },
            }),
          ]}
        >
          <DatePicker
            placeholder="Select end date"
            style={{ width: "60%" }}
            disabledDate={(current) => {
              const currentDate = dayjs(current);
              const today = dayjs();
              return currentDate.isBefore(today, "day");
            }}
            format="DD/MM/YYYY"
          ></DatePicker>
        </Form.Item>
        <Form.Item
          label={<Text>Priority</Text>}
          name="priority"
          style={{ marginRight: 10 }}
          rules={[
            {
              required: true,
              message: "Priority must not be a blank",
            },
          ]}
        >
          <Select
            style={{ width: "60%" }}
            placeholder="Choose task priority"
            options={[
              {
                value: 0,
                label: (
                  <Tag color="yellow">
                    <ArrowDownOutlined /> LOW
                  </Tag>
                ),
              },
              {
                value: 1,
                label: (
                  <Tag color="green">
                    <RiseOutlined /> MEDIUM
                  </Tag>
                ),
              },
              {
                value: 2,
                label: (
                  <Tag color="red">
                    <IssuesCloseOutlined /> HIGH
                  </Tag>
                ),
              },
            ]}
          ></Select>
        </Form.Item>
        <Form.Item
          label={<Text>imgLink</Text>}
          name="imgLink"
          style={{ marginRight: 10 }}
        >
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </Form.Item>
        <Row gutter={24} style={{ width: "100%" }}>
          <Col
            span={24}
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Form.Item>
              <Button className="custom-btn-close" onClick={handleCancel}>
                Cancel
              </Button>
            </Form.Item>
            <Button
              className="custom-btn-watch-report"
              htmlType="submit"
              icon={<EditOutlined></EditOutlined>}
            >
              Edit
            </Button>
          </Col>
        </Row>
      </Form>
      <Modal
        visible={isSuccessMessageVisible}
        onCancel={() => setIsSuccessMessageVisible(false)}
        onOk={() => setIsSuccessMessageVisible(false)}
      ></Modal>
    </>
  );
};

EditBacklogs.propTypes = {
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object,
};

export default EditBacklogs;
