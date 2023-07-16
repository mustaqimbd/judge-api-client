import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { AuthContext } from "./AuthProvider";

const Login = () => {
  const { loginUser, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      
      loginUser(values.email, values.password)
        .then((result) => {
          resetForm();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Logged in",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(redirectTo, { replace: true });
        })
        .catch((err) => {
          
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Password or email wrong!",
            showConfirmButton: false,
            timer: 3000,
          });
        });
    },
  });

  const handleGoogleSingIn = () => {
    googleSignIn()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Successfully Logged in",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(redirectTo, { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-md mx-auto p-5 rounded-lg my-5 shadow-lg border"
      >
        <h1 className="text-3xl font-bold text-center col-span-2">
          Please Login
        </h1>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formik.errors.email ? (
            <div className="text-red-600">{formik.errors.email}</div>
          ) : null}
        </div>

        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password:
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            value={formik.values.password}
            className="appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <span
            className="absolute top-10 right-4 cursor-pointer"
            onClick={handleTogglePassword}
          >
            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
          </span>
          {formik.errors.password ? (
            <div className="text-red-600">{formik.errors.password}</div>
          ) : null}
        </div>

        <div className="col-span-2 text-center">
          <button
            type="submit"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 w-[100px] rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
      <div className="text-center mb-14">
        <button
          onClick={handleGoogleSingIn}
          className="text-lg font-bold bg-gray-500 hover:bg-gray-700 text-white flex items-center gap-1  py-2 px-4 mb-2 rounded w-[220px] mx-auto"
        >
          <FcGoogle />
          Log in with google
        </button>
        <p>
          Don&apos;t have an account? Please{" "}
          <Link to="/sign-up" className="text-lg font-bold text-blue-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
