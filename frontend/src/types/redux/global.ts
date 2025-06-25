import type { store } from "@/store/store";
import type { RootState as ReduxRootState } from "@/store/store";

export type RootState = ReduxRootState;
export type AppDispatch = typeof store.dispatch;

import type { ThunkDispatch as ReduxThunkDispatch } from "@reduxjs/toolkit";
export type ThunkAppDispatch = ReduxThunkDispatch<RootState, any, any>;