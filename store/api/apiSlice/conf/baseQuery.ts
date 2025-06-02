import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { getAuthToken, getRefreshToken, isTokenExpired, logout, setAuthToken, setRefreshToken } from "@/lib/utils/authUtil";

/**
 * This is the base query for RTK Query, which is used to make API requests.
 * It sets the base URL and prepares headers for each request.
 * @returns {BaseQueryFn} - The base query function for RTK Query.
 */

export const baseQueryWithoutReauth = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_ENDPOINT,
  prepareHeaders: (headers) => {

    const token = getAuthToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
    }
    headers.set("API_KEY", `${process.env.NEXT_PUBLIC_API_KEY}`);
    headers.set("SECRET_KEY", `${process.env.NEXT_PUBLIC_SECRET_KEY}`);

    return headers;
  },

});

export const baseQueryWithReauth:BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: any, api: any, extraOptions: any) => {

  let token = getAuthToken();

  if(token && isTokenExpired(token)){
    
    const refresh = await refreshToken()

    if (!refresh) {
      return { error: { status: 403, data: { message: "Refresh token not found" } } };
    }
  }

  let result = await baseQueryWithoutReauth(args, api, extraOptions);

    
  if (result.error && result.error.status === 403){

    const refreshResult = await getRefreshToken();

    if(refreshResult){
      result = await baseQueryWithoutReauth(args, api, extraOptions);
    }
    else{
    logout();
    }

  }
  return result;
}

async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}${process.env.NEXT_PUBLIC_REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "API_KEY": `${process.env.NEXT_PUBLIC_API_KEY}`,
        "SECRET_KEY": `${process.env.NEXT_PUBLIC_SECRET_KEY}`
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    
    // Store the new tokens
    setAuthToken(data.accessToken);
    
    // If backend also returns a new refresh token
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token);
    }
    
    return true;
  } catch (error) {

    return false;
  }
}
