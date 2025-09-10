import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const user = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/profile`,
        { withCredentials: true }
      );
      console.log(user);
      dispatch(addUser(user.data));
    } catch (err) {
      navigate("/login");
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;
