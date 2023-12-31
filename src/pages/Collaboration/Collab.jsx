import { useEffect, useState } from "react";
import {
  UserOutlined,
  MailOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Spin,
  Table,
  Input,
  Select,
  Modal,
  Form,
  message,
  Typography,
  Popconfirm,
} from "antd";
import AddMember from "./AddMember";
import { useDispatch, useSelector } from "react-redux";
import {
  getDSMemberAllSelector,
  isAdminSelector,
  roleSelector,
} from "../../Redux/Selector";
import {
  deleteMember,
  editRole,
  getDSMember,
  getRole,
  isAdminOfProject,
} from "../../Redux/Slices/Collaboration/CollaborationSlice";
import { setShowForm2 } from "../../Redux/Slices/StateChange/StateChangeSlice";
import { getImage } from "../../helper/uploadImage";
const { Text } = Typography;

const Collab = () => {
  const [loading, setLoading] = useState(true);
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const dispatch = useDispatch();
  const dsMemberAll = useSelector(getDSMemberAllSelector);
  const [refreshTable, setRefreshTable] = useState(false);
  const isAdmin = useSelector(isAdminSelector);
  const roleM = useSelector(roleSelector);

  const showModalTaoDon = () => {
    setIsModalAdd(true);
  };

  const closeAddModal = () => {
    setIsModalAdd(false);
    form.resetFields();
    form2.resetFields();
    dispatch(setShowForm2(false));
    setRefreshTable(!refreshTable);
  };

  useEffect(() => {
    const projectID = sessionStorage.getItem("current_project");
    dispatch(getDSMember(projectID))
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data: ", error);
      });
  }, [refreshTable]);

  useEffect(() => {
    const projectID = sessionStorage.getItem("current_project");
    dispatch(getRole(projectID))
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data: ", error);
      });
  }, [refreshTable]);

  useEffect(() => {
    const projectID = sessionStorage.getItem("current_project");
    dispatch(isAdminOfProject(projectID))
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data: ", error);
      });
  }, [refreshTable]);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(dsMemberAll);

  useEffect(() => {
    const newFilteredData = dsMemberAll.filter((_dsMemberAll) => {
      const fullName = `${_dsMemberAll.name} `;
      return fullName.toLowerCase().includes(searchText.toLowerCase());
    });
    setFilteredData(newFilteredData);
  }, [searchText, dsMemberAll]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDelete = (removeID) => {
    if (removeID) {
      dispatch(deleteMember(removeID))
        .unwrap()
        .then((result) => {
          message.success(result, 1.5);
          setRefreshTable(!refreshTable);
        })
        .catch((error) => {
          message.error(error, 1.5);
        });
    }
  };

  const [form1] = Form.useForm();

  const handleFormEditRole = (values, changeeID) => {
    const data = { ...values, changeeID };
    if (data) {
      dispatch(editRole(data))
        .unwrap()
        .then((result) => {
          message.success(result, 1.5);
          setRefreshTable(!refreshTable);
        })
        .catch((error) => {
          message.error(error, 1.5);
        });
    }
  };
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    const promises = filteredData.map((_filteredData) => {
      const memberId = _filteredData.id;
      return getImageEdit(memberId);
    });

    Promise.all(promises)
      .then((urls) => {
        setImageUrl(urls);
      })
      .catch(() => {
        // console.error("Error getting images:", error);
      });
  }, [filteredData]);

  const getImageEdit = async (memberId) => {
    if (memberId) {
      try {
        const url = await getImage(memberId);
        return url;
      } catch (error) {
        // console.error("Error getting image:", error);
        return null;
      }
    } 
  };

  const column = [
    {
      title: (
        <span>
          <UserOutlined /> Tên thành viên
        </span>
      ),
      dataIndex: "avatarAndName",
      key: "avatarAndName",
      width: 100,
    },
    {
      title: (
        <span>
          <MailOutlined /> Email
        </span>
      ),
      dataIndex: "email",
      key: "email",
      width: 150,
    },
    {
      title: (
        <span>
          <MailOutlined /> Role
        </span>
      ),
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (text, record) => (
        <div>
          <Form
            onFinish={(values) => handleFormEditRole(values, record.key)}
            form={form1[record.key]}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: 0,
            }}
          >
            <Form.Item
              initialValue={record.role}
              name="role"
              style={{ flex: 1, marginRight: 10, marginBottom: 0 }}
              rules={[
                { required: true, message: "Member Role must not be a blank" },
              ]}
            >
              {record.role && !record.role.includes(0) ? (
                <Select
                  placeholder="Choose role"
                  mode="tags"
                  disabled={isAdmin.isAdmin !== true}
                  options={[
                    { value: 1, label: "Owner", disabled: true },
                    {
                      value: 2,
                      label: "Manager",
                      disabled:
                        roleM.result && roleM.result.includes("manager")
                          ? true
                          : false,
                    },
                    {
                      value: 3,
                      label: "Dev",
                    },
                    {
                      value: 4,
                      label: "Tester",
                    },
                  ]}
                ></Select>
              ) : (
                <Text>Pending</Text>
              )}
            </Form.Item>
            {isAdmin.isAdmin !== true ? (
              ""
            ) : record.role && !record.role.includes(0) ? (
              <Button
                icon={<EditOutlined style={{ marginTop: 5 }} />}
                className="custom-btn-save-and-add"
                htmlType="submit"
              >
                EDIT
              </Button>
            ) : (
              ""
            )}
          </Form>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Are you sure you want to delete member?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="custom-btn-del"
              icon={<DeleteOutlined />}
              style={{
                display:
                  (record.role && record.role.includes(0)) ||
                  (roleM.result && roleM.result.includes("manager"))
                    ? "none"
                    : "",
              }}
            >
              DELETE
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
          <div>
            <div>
              <Input.Search
                allowClear
                placeholder="Input member name"
                style={{ width: "25%", marginBottom: 20 }}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
              />
              <Button
                className="custom-btn-add-d"
                icon={<PlusOutlined />}
                onClick={showModalTaoDon}
                style={{
                  float: "right",
                  display:
                    isAdmin.isAdmin !== true
                      ? "none"
                      : roleM.result && roleM.result.includes("manager")
                      ? "none"
                      : "",
                }}
              >
                Add members
              </Button>
            </div>
            <div style={{ maxHeight: 500, overflow: "auto" }}>
              <Table
                scroll={{ x: 600 }}
                columns={
                  isAdmin.isAdmin !== true
                    ? column.slice(0, 3)
                    : roleM.result && roleM.result.includes("manager")
                    ? column.slice(0, 3)
                    : column
                }
                dataSource={
                  filteredData &&
                  Array.isArray(filteredData) &&
                  filteredData.map((_filteredData, index) => {
                    const memberId = _filteredData.id;
                    return {
                      index: index + 1,
                      key: memberId,
                      avatarAndName: (
                        <span>
                          <Avatar
                            src={
                              imageUrl[index] && (
                                <img
                                  src={imageUrl[index]}
                                  style={{
                                    margin: 0,
                                  }}
                                  alt={`Avatar ${index + 1}`}
                                ></img>
                              )
                            }
                            style={{
                              backgroundColor: imageUrl[index]
                                ? "transparent"
                                : "#FF4500",
                            }}
                          >
                            {imageUrl[index]
                              ? null
                              : `${_filteredData.name}`.charAt(0)}
                          </Avatar>{" "}
                          {`${_filteredData.name}`.substring(0)}
                        </span>
                      ),

                      email: _filteredData.email,
                      role: _filteredData.role,
                    };
                  })
                }
                bordered
                size="middle"
              />
            </div>
            <Modal
              open={isModalAdd}
              footer={null}
              onCancel={closeAddModal}
              title="Add member"
              width={700}
            >
              <AddMember
                form={form}
                form2={form2}
                onClose={closeAddModal}
              ></AddMember>
            </Modal>
          </div>
        </>
      )}
    </>
  );
};

export default Collab;
