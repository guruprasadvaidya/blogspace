
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const signin = async (data) => {
    setError("");

    try {
      const session = await authService.login(data);

      if (session) {
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          dispatch(login(currentUser));
          navigate("/");
        } else {
          setError("Sign in was unsuccessful. Please try again.");
        }
      }
    } catch (error) {
      setError(
        error.message || "Unable to sign in. Please check your details."
      );
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-[#FAFAF8] px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#EAE7E2] bg-white p-6 shadow-sm sm:p-9 lg:p-10">

        <div className="mb-8 flex justify-center">
          <Logo width="auto" />
        </div>

        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#7956A8]">
            Welcome back
          </p>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#211D25] sm:text-4xl">
            Sign in to Blogspace
          </h1>

          <p className="text-sm leading-6 text-[#77717C]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#7956A8] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(signin)}>
          <div className="space-y-5">

            <Input
              label="Email address"
              placeholder="Enter your email address"
              type="email"
              {...register("email", { required: true })}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...register("password", { required: true })}
            />

            <Button
              type="submit"
              className="w-full"
            >
              Sign In
            </Button>

          </div>
        </form>

        <p className="mt-7 text-center text-xs leading-5 text-[#99929D]">
          By signing in, you agree to use Blogspace responsibly.
        </p>

      </div>
    </div>
  );
}

export default Login;
