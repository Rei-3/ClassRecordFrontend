import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import authReducer from '@/store/api/slices/authSlice'; 
import teachingLoadReducer from '@/store/api/slices/teachingLoadSlice';
import { authApi } from './api/apiSlice/authApiSlice';
import { getTeachingLoad } from './api/apiSlice/get/teachingLoadApiSlice';
import { postTeachingLoadApi } from './api/apiSlice/post/TeachingLoadApiSlice';
import { getSemApi } from './api/apiSlice/get/semApiSlice';
import { getSubjectApi } from './api/apiSlice/get/subjectApiSlice';
import { getGradesApi } from './api/apiSlice/get/gradesApiSlice';
import searchReducer from './api/slices/searchSice';
import { postGradesApiSlice } from './api/apiSlice/post/gradesApiSlice';
import { putGradesApiSlice } from './api/apiSlice/put/gradesApiSlice';
import scoreReducer from './api/slices/scoreSlice';
import { getAdminApiSlice } from './api/apiSlice/get/adminApiSlice';



const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authReducer,
    score: scoreReducer,
    search: searchReducer,
    teachingLoad: teachingLoadReducer,
    [authApi.reducerPath]: authApi.reducer,
    //get
    [getTeachingLoad.reducerPath]: getTeachingLoad.reducer,
    [getSemApi.reducerPath]: getSemApi.reducer,
    [getSubjectApi.reducerPath]: getSubjectApi.reducer,
    [getGradesApi.reducerPath]: getGradesApi.reducer,
    [getAdminApiSlice.reducerPath]: getAdminApiSlice.reducer,

    //put
    [putGradesApiSlice.reducerPath]: putGradesApiSlice.reducer,
    
    //post
    [postTeachingLoadApi.reducerPath]: postTeachingLoadApi.reducer,
    [postGradesApiSlice.reducerPath]: postGradesApiSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            //post
            postTeachingLoadApi.middleware,
            postGradesApiSlice.middleware,

            //put
            putGradesApiSlice.middleware,
            //get
            getSemApi.middleware,
            getSubjectApi.middleware,
            getTeachingLoad.middleware,
            getGradesApi.middleware,
            getAdminApiSlice.middleware
        ),
});

export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;