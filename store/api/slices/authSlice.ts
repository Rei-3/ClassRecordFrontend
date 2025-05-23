import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthResponse } from "../types/authType";

interface AuthState {
    username: AuthResponse ['username'] | null;
    isAuthenticated: boolean;
    fname?: AuthResponse['fname'];
    lname?: AuthResponse['lname'];
    role?: AuthResponse['role'];
}

const initialState: AuthState = {
    username: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setAuth : (state, action: PayloadAction<AuthResponse>) =>{
            state.username = action.payload.username;
            state.isAuthenticated = true;
            state.fname = action.payload.fname;
            state.lname = action.payload.lname;
            state.role = action.payload.role;
        },
        clearAuth: (state) => {
            state.username = null;
            state.isAuthenticated = false;
        }
    }
});

export const {setAuth, clearAuth} = authSlice.actions;
export default authSlice.reducer;