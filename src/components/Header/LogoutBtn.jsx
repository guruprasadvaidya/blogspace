
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={logoutHandler}
      className="rounded-full border border-[#E3DCEB] px-5 py-2 text-sm font-semibold text-[#7956A8] transition hover:bg-[#F0ECF5]"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
