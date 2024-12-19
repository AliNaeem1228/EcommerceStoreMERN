import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAction } from "../../../redux/slices/users/usersSlice";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";

const RegisterForm = () => {
  //dispatch
  const dispatch = useDispatch();
  //dispatch
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  //---Destructuring---
  const { name, email, password } = formData;
  //---onchange handler----
  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //---onsubmit handler----
  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(registerUserAction({ name, email, password }));
  };
  //select store data
  const { user, error, loading } = useSelector((state) => state?.users);
  //redirect
  useEffect(() => {
    if (user) {
      window.location.href = "/login";
    }
  }, [user]);
  return (
    <>
      <section className="relative overflow-x-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-2/6 px-4 mb-12 lg:mb-0">
              <div className="py-20 text-center">
                <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                  Signing up with social is super quick
                </h3>
                {/* errr */}
                {error && <ErrorMsg message={error?.message} />}
                <p className="mb-10">Please, do not hesitate</p>
                <form onSubmit={onSubmitHandler}>
                  <input
                    name="name"
                    value={name}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="text"
                    placeholder="Enter your Name"
                    autoComplete="off"
                    required
                  />
                  <input
                    name="email"
                    value={email}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="off"
                    required
                  />
                  <input
                    name="password"
                    value={password}
                    onChange={onChangeHandler}
                    className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                    type="password"
                    placeholder="Enter your password"
                    required
                    pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"
                    title="Password must be at least 8 characters long, contain at least one uppercase letter, and one special character (!@#$%^&*)."
                    autoComplete="off"
                  />

                  {loading ? (
                    <LoadingComponent />
                  ) : (
                    <button className="mt-12 md:mt-16 bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                      Register
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="hidden lg:block lg:absolute top-0 bottom-0 right-0 lg:w-3/6 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://cdn.pixabay.com/photo/2017/03/29/04/47/high-heels-2184095_1280.jpg")',
          }}
        />
      </section>
    </>
  );
};

export default RegisterForm;
