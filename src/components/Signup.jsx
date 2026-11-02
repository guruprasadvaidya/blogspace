
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const signup = async (data) => {
    setError("");

    try {
      const session = await authService.createAccount(data);

      if (session) {
        const currentUser = await authService.getCurrentUser();

        if (currentUser) {
          dispatch(login(currentUser));
          navigate("/");
        } else {
          setError(
            "Account created, but automatic sign-in failed. Please sign in."
          );
        }
      }
    } catch (error) {
      setError(error.message || "Unable to create your account.");
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
            Join our community
          </p>

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-[#211D25] sm:text-4xl">
            Create your account
          </h1>

          <p className="text-sm leading-6 text-[#77717C]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#7956A8] hover:underline"
            >
              Sign in
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

        <form onSubmit={handleSubmit(signup)}>
          <div className="space-y-5">

            <Input
              label="Full name"
              placeholder="Enter your full name"
              type="text"
              {...register("name", { required: true })}
            />

            <Input
              label="Email address"
              placeholder="Enter your email address"
              type="email"
              {...register("email", { required: true })}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              type="password"
              {...register("password", { required: true })}
            />

            <Button
              type="submit"
              className="w-full"
            >
              Create Account
            </Button>

          </div>
        </form>

        <p className="mt-7 text-center text-xs leading-5 text-[#99929D]">
          Join Blogspace and start sharing your ideas.
        </p>

      </div>
    </div>
  );
}

export default Signup;
