'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import IconMail from '@/components/icon/icon-mail';
import IconLockDots from '@/components/icon/icon-lock-dots';
import { useLoginUserMutation } from '@/store/api/apiSlice/authApiSlice';
import { getAuthToken, getRefreshToken, setAuthToken, setRefreshToken } from '@/lib/utils/authUtil';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/api/slices/authSlice';
import isFetchBaseQueryError from '@/lib/utils/error';

const schema = z.object({
  username: z.string().nonempty({ message: "Username is required" }),
  password: z.string().nonempty({ message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

const ComponentsAuthLoginForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const dispatch = useDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try{

      const response = await loginUser(data).unwrap();
      setAuthToken(response.token);
      setRefreshToken(response.refreshToken);
      dispatch(setAuth({
        username: response.username,
        fname: response.fname,
        lname: response.lname,
        role: response.role,
      }))
      
      if(response.role === 'admin'){
        router.push('/admin');
      }else if(response.role === 'teacher'){
        router.push('/teaching-loads');
      }
      // router.push('/teaching-loads');
    }
    catch(err:any){
    
      if (isFetchBaseQueryError(err)) {
        const errorData = err.data as { message?: string, errorType?: string, code?: number };
        const errorMessage = errorData?.message || 'An unknown error occurred.';
        setErrorMessage(errorMessage);
      }else if (err instanceof Error) {
        console.error('Error:', err.message);
      }
        
    }
  };

  return (
    <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Username</label>
        <div className="relative text-white-dark">
          <input
            id="username"
            {...register("username")}
            type="username"
            placeholder="Enter Username"
            className="form-input ps-10 placeholder:text-white-dark"
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            <IconMail fill={true} />
          </span>
        </div>
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <div className="relative text-white-dark">
          <input
            id="password"
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="form-input ps-10 placeholder:text-white-dark"
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            <IconLockDots fill={true} />
          </span>
        </div>
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        <div className="mt-2 flex items-center">
          <input
            id="showPassword"
            type="checkbox"
            checked={showPassword}
            onChange={toggleShowPassword}
            className="form-checkbox bg-white dark:bg-black"
          />
          <label htmlFor="showPassword" className="ml-2 text-white-dark mt-2">Show Password</label>
        </div>
      </div>
     
      <div className="text-center">
        {errorMessage && (<h1 className="text-red-500">{errorMessage}</h1>)}
        <h1 className="text-base font-bold text-white-dark">
          Press Sign In After Entering Credentials
        </h1>
      </div>
      <button
        type="submit"
        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
      >
        Sign In
      </button>
    </form>
  );
};

export default ComponentsAuthLoginForm;
