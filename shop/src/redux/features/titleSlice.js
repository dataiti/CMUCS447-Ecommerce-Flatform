import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
};

const titleSlice = createSlice({
  name: "title",
  initialState,
  reducers: {
    setTitleHeader: (state, action) => {
      state.title = action.payload;
    },
    clearTitleHeader: (state) => {
      state.title = "";
    },
  },
  extraReducers: (builder) => {},
});

export const titleSelect = (state) => state.title;
export const { setTitleHeader, clearTitleHeader } = titleSlice.actions;
export default titleSlice.reducer;
