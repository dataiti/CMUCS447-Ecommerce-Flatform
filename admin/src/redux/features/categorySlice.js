import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCategoryApi,
  getListCategoriesForAdminApi,
  updateCategoryApi,
  removeCategoryApi,
  getCategoryApi,
} from "../../apis/category";

const getListCategoriesForAdminThunkAction = createAsyncThunk(
  "auth/getListCategoriesForAdmin",
  async ({ orderBy, sortBy, q, limit, page, userId }, thunkAPI) => {
    try {
      const res = await getListCategoriesForAdminApi({
        orderBy,
        sortBy,
        q,
        limit,
        page,
        userId,
      });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const getCategoryThunkAction = createAsyncThunk(
  "auth/getCategory",
  async (categoryId, thunkAPI) => {
    try {
      return await getCategoryApi(categoryId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const createCategoryThunkAction = createAsyncThunk(
  "auth/createCategory",
  async (formData, thunkAPI) => {
    try {
      return await createCategoryApi(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const updateCategoryThunkAction = createAsyncThunk(
  "auth/updateCategory",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await updateCategoryApi({ id, formData });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const removeCategoryThunkAction = createAsyncThunk(
  "auth/removeCategory",
  async (categoryId, thunkAPI) => {
    try {
      return await removeCategoryApi(categoryId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  listCategories: [],
  category: {},
  totalPage: 0,
  currentPage: 0,
  count: 0,
};

const categorySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getListCategoriesForAdminThunkAction.fulfilled,
        (state, action) => {
          state.listCategories = action.payload?.data;
          state.totalPage = action.payload?.totalPage;
          state.currentPage = action.payload?.currentPage;
          state.count = action.payload?.count;
        }
      )
      .addCase(getCategoryThunkAction.fulfilled, (state, action) => {
        state.category = action.payload?.data;
      })
      .addCase(createCategoryThunkAction.fulfilled, (state, action) => {
        state.listCategories.push(action.payload?.data);
      })
      .addCase(updateCategoryThunkAction.fulfilled, (state, action) => {
        state.listCategories.find((category, index) => {
          if (category._id === action.payload?._id) {
            state.listCategories[index] = action?.payload;
            return true;
          }
        });
        return false;
      })
      .addCase(removeCategoryThunkAction.fulfilled, (state, action) => {
        const categoryId = action.meta.arg;
        const removeCategoryIndex = state.listCategories.findIndex(
          (category) => category._id === categoryId
        );
        if (removeCategoryIndex != -1) {
          state.listCategories.splice(removeCategoryIndex, 1);
        }
      });
  },
});

export {
  getListCategoriesForAdminThunkAction,
  getCategoryThunkAction,
  createCategoryThunkAction,
  updateCategoryThunkAction,
  removeCategoryThunkAction,
};
export const categorySelect = (state) => state.category;
export const {} = categorySlice.actions;
export default categorySlice.reducer;
