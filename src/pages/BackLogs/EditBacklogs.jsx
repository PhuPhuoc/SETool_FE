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
  message,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { getDSTaskByIdSelector, getKeyIdSelector } from "../../Redux/Selector";
import {
  editBacklogs,
  getDSTaskById,
} from "../../Redux/Slices/Backlogs/BacklogsSlice";
import { setKeyId } from "../../Redux/Slices/StateChange/StateChangeSlice";

const EditBacklogs = ({ onClose, form1 }) => {
  const dispatch = useDispatch();
  const taskByID = useSelector(getDSTaskByIdSelector);
  const [refreshTable, setRefreshTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const taskID = useSelector(getKeyIdSelector);

  useEffect(() => {
    if (taskID !== null) {
      setLoading(true);
      dispatch(getDSTaskById(taskID))
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching data: ", error);
        });
    }
  }, [refreshTable,taskID,dispatch]);

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

  const handleFormEdit = (values) => {
    const data = { ...values, taskID };
    console.log("backlogs add: ", data);
    if (data) {
      dispatch(editBacklogs(data))
        .unwrap()
        .then((result) => {
          message.success(result);
          form1.resetFields();
          setRefreshTable(!refreshTable);
          dispatch(setKeyId(null));
          onClose();
        })
        .catch((error) => {
          message.error(error);
        });
    }
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
    form1.resetFields();
    setRefreshTable(!refreshTable);
    setIsSuccessMessageVisible(false);
    onClose();
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <Spin
            size="large"
            style={{ fontSize: "77px", marginRight: "17px" }}
          ></Spin>
          <h1 style={{ color: "blue", marginTop: "33px", fontSize: "37px" }}>
            Vui Lòng Đợi Trong Giây Lát...
          </h1>
        </div>
      ) : (
        <>
          <Form
            {...layout}
            form={form1}
            onFinish={handleFormEdit}
            style={{ maxHeight: 598, marginTop: "10px", overflow: "auto" }}
          >
            <Form.Item
              label={<Text>Project name</Text>}
              name="taskName"
              initialValue={taskByID && taskByID.data.taskName}
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
              name="taskDescription"
              initialValue={taskByID && taskByID.data.taskDescription}
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
              initialValue={taskByID && taskByID.data.taskType}
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
              label={<Text>Priority</Text>}
              name="taskPriority"
              initialValue={taskByID && taskByID.data.taskPriority}
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
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
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
      )}
    </>
  );
};

EditBacklogs.propTypes = {
  onClose: PropTypes.func.isRequired,
  form1: PropTypes.object,
};

export default EditBacklogs;
