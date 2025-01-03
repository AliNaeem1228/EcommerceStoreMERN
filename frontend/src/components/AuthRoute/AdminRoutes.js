import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../redux/slices/users/usersSlice";
import AdminOnly from "../NotAuthorised/AdminOnly";

const AdminRoutes = ({ children }) => {
  console.log("ddd");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);
  const { userAuth } = useSelector((state) => state?.users);
  const isAdmin = userAuth?.userInfo?.userFound?.isAdmin ? true : false;
  if (!isAdmin) return <AdminOnly />;
  return <>{children}</>;
};

export default AdminRoutes;
