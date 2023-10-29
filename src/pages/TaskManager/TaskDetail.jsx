import {
  Row,
  Col,
  Typography,
  Space,
  Form,
  Input,
  Avatar,
  Button,
  Divider,
  List,
  Progress,
  Tag,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
const { Title, Text } = Typography;
const { Item } = List;
import {
  PlusOutlined,
  CheckSquareOutlined,
  UnorderedListOutlined,
  MonitorOutlined,
  PullRequestOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getDSMytaskDetail } from "../../Redux/Slices/TaskManager/TaskManagerSlice";
import { getDSMyTaskDetailSelector } from "../../Redux/Selector";
import dayjs from "dayjs";
const TaskDetail = ({ idTask }) => {
  const taskID = idTask.id;

  const [refreshTable, setRefreshTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const taskDetail = useSelector(getDSMyTaskDetailSelector);
  console.log(taskDetail);

  useEffect(() => {
    if (taskID) {
      dispatch(getDSMytaskDetail(taskID))
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching data: ", error);
        });
    }
  }, [refreshTable, taskID]);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "User1",
      text: "This is the first comment.",
    },
    {
      id: 2,
      author: "User2",
      text: "This is another comment.",
    },
  ]);
  const [comment, setComment] = useState("");
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim() !== "") {
      const newComment = {
        id: comments.length + 1,
        author: "UserX",
        text: comment,
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const historyData = [
    {
      time: "2023-10-01",
      status: "To Do",
      statusKey: "todo",
    },
    {
      time: "2023-10-02",
      status: "In Progress",
      statusKey: "inProgress",
    },
    {
      time: "2023-10-03",
      status: "Testing",
      statusKey: "testing",
    },
    {
      time: "2023-10-02",
      status: "In Progress",
      statusKey: "inProgress",
    },
    {
      time: "2023-10-03",
      status: "Testing",
      statusKey: "testing",
    },
    {
      time: "2023-10-04",
      status: "Done",
      statusKey: "done",
    },
  ];

  const statusColors = {
    1: "#F29F05",
    2: "#F99A9C",
    3: "#F2D98D",
    4: "#84D9BA",
  };

  const statusPercentages = {
    1: 25,
    2: 50,
    3: 75,
    4: 100,
  };

  const statusIcons = {
    1: <UnorderedListOutlined />,
    2: <PullRequestOutlined />,
    3: <MonitorOutlined />,
    4: <CheckSquareOutlined />,
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
          <Row gutter={24} style={{ width: "100%" }}>
            <Col
              span={16}
              style={{
                overflow: "auto",
                maxHeight: "550px",
                lineHeight: 2.5,
                width: "100%",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>
                  <Tag color="yellow"> task ID: {taskID} </Tag>
                </Text>
                <Title style={{ marginBottom: 8 }}>{taskDetail.taskName}</Title>
                <Text>{taskDetail.taskDescription}</Text>
                <Divider style={{ border: "1px solid gray" }}></Divider>
                <Form
                  style={{
                    marginLeft: 8,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Form.Item
                    label={<Avatar>A</Avatar>}
                    style={{ marginBottom: 8 }}
                  >
                    <Input.TextArea
                      name="comment"
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Input your comment"
                    ></Input.TextArea>
                  </Form.Item>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      icon={<PlusOutlined />}
                      className="custom-btn-add-d"
                      htmlType="submit"
                      onClick={handleCommentSubmit}
                    >
                      Add Comment
                    </Button>
                  </div>
                </Form>
                <List
                  header={<div>Comments</div>}
                  itemLayout="horizontal"
                  dataSource={comments}
                  renderItem={(item) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{item.author.charAt(0)}</Avatar>}
                        title={`Comment by ${item.author}`}
                        description={item.text}
                      />
                    </Item>
                  )}
                />
              </Space>
            </Col>
            <Col
              span={8}
              style={{ overflow: "auto", maxHeight: "600px", lineHeight: 2.5 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Row gutter={24}>
                  <Col span={6}>
                    <Tag color="blue">Task Type</Tag>
                  </Col>
                  <Col span={18}>
                    <Text>{taskDetail.taskType !== 1 ? "DEV" : "QA"}</Text>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6}>
                    <Tag color="red">Status</Tag>
                  </Col>
                  <Col span={18}>
                    <Text>
                      {taskDetail.taskStatus === 1
                        ? "To Do"
                        : taskDetail.taskStatus === 2
                        ? "In Progress"
                        : taskDetail.taskStatus === 3
                        ? "Testing"
                        : taskDetail.taskStatus === 4
                        ? "Done"
                        : "Unknown"}
                    </Text>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6}>
                    <Tag color="purple">Sprint</Tag>
                  </Col>
                  <Col span={18}>
                    <Text>Sprint {taskDetail.sprintNumber}</Text>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6}>
                    <Tag color="geekblue">Assignee</Tag>
                  </Col>
                  <Col span={18}>
                    <Text>{taskDetail.assigneeName}</Text>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={6}>
                    <Tag color="magenta">Reporter</Tag>
                  </Col>
                  <Col span={18}>
                    <Text>{taskDetail.reporterName}</Text>
                  </Col>
                </Row>
                <List
                  style={{ width: "100%" }}
                  header={
                    <div>
                      <HistoryOutlined /> History
                    </div>
                  }
                  itemLayout="horizontal"
                  dataSource={taskDetail.history}
                  renderItem={(item) => (
                    <Item>
                      <Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: statusColors[item.taskState],
                            }}
                          >
                            {statusIcons[item.taskState]}
                          </Avatar>
                        }
                        title={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text>
                              {item.committer} -{" "}
                              {dayjs(item.commitDate).format("DD/MM/YYYY")}
                            </Text>
                            <Text>
                              {item.taskState === 1
                                ? "To Do"
                                : item.taskState === 2
                                ? "In Progress"
                                : item.taskState === 3
                                ? "Testing"
                                : item.taskState === 4
                                ? "Done"
                                : "Unknown"}
                            </Text>
                          </div>
                        }
                        description={
                          <Progress
                            size="small"
                            percent={statusPercentages[item.taskState]}
                            showInfo={false}
                            strokeColor={statusColors[item.taskState]}
                          />
                        }
                      />
                    </Item>
                  )}
                />
              </Space>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

TaskDetail.propTypes = {
  idTask: PropTypes.object.isRequired,
};

export default TaskDetail;
