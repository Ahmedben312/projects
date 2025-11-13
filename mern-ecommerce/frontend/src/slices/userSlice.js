import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    const { data } = await axios.post("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    return data.user;
  }
);

export const register = createAsyncThunk(
  "user/register",
  async ({ name, email, password }) => {
    const { data } = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    return data.user;
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
  return null;
});

export const getMe = createAsyncThunk("user/getMe", async () => {
  const { data } = await axios.get("/api/auth/me");
  return data;
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default userSlice.reducer;
