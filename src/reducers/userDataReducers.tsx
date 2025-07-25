import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserDataState {
  lastName: string;
  firstName: string;
  phoneNumber: string;
}

const initialState: UserDataState = {
  lastName: "",
  firstName: "",
  phoneNumber: "",
};

export const UserDataStateSlice = createSlice({
  name: "UserDataState",
  initialState,
  reducers: {
    addUserName: (state, action: PayloadAction<UserDataState>) => {
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
    },
    addUserPhone: (state, action: PayloadAction<string>) => {
       state.phoneNumber = action.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { addUserName, addUserPhone} =
  UserDataStateSlice.actions;

export default UserDataStateSlice.reducer;
