import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, postRequest } from "../../../Services/HttpMethods";
import dayjs from "dayjs";

const initialState = {
  dsProject: [],
  isAddedSuccess: false,
  isDeletedSuccess: false,
};

export const HomePagesSlice = createSlice({
  name: "homepage",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getDSProject.fulfilled, (state, action) => {
      state.dsProject = action.payload;
    });
  },
});

export const getDSProject = createAsyncThunk(
  "homepage/getDSProject",
  async () => {
    try {
      const res = await getRequest(`projects/get-project-by-userID`);
      return res.data;
    } catch (error) {
      console.log({ error });
    }
  }
);
const userID_current = sessionStorage.getItem("name_current");

export const createProject = createAsyncThunk(
  "homepage/createProject",
  async (values, { rejectWithValue, fulfillWithValue }) => {
    try {
      let {
        projectName,
        projectDescription,
        projectStartDay,
        projectEndDay,
        projectTotalSprint,
        projectDayPerSprint,
      } = values;
      const userID = userID_current;
      projectStartDay = dayjs(projectStartDay).format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      );
      projectEndDay = dayjs(projectEndDay).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      const res = await postRequest(`projects/create-project/${userID}`, {
        projectName,
        projectDescription,
        projectStartDay,
        projectEndDay,
        projectPriority: 1,
        projectTotalSprint,
        projectDayPerSprint,
      });
      if (res.data?.status === 200) {
        return fulfillWithValue("Đã tạo project thành công");
      }
      if (res.response?.status === 400) {
        const err = res.response.data.error;
        return rejectWithValue(err);
      }
    } catch (error) {
      return rejectWithValue("Tạo project thất bại!");
    }
  }
);