import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export default function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    return typeof error === 'object' && error != null && 'status' in error;
  }
