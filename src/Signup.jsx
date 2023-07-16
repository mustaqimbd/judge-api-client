import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "./AuthProvider";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAxios from "./UseAxios";

const Signup = () => {
  const [instance] = useAxios();
  const { createUser, updateUserProfile, googleSignIn } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
     
      createUser(values.email, values.password)
        .then((result) => {
         
          updateUserProfile(values.name)
            .then(() => {
              const user = {
                name: values.name,
                email: values.email,
              };
              instance
                .post("/user/login", user)
                .then((res) => {
                  if (res.data.insertedId) {
                    resetForm();
                    Swal.fire({
                      position: "top-end",
                      icon: "success",
                      title: "Successfully Registered",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    navigate("/", { replace: true });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const handleGoogleSingIn = () => {
    googleSignIn()
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        instance
          .post("/user", {
            name: displayName,
            email,
            photoURL,
          })
          .then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Successfully signed up",
                showConfirmButton: false,
                timer: 1500,
              });
              navigate("/", { replace: true });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-md mx-auto p-5 gap-5 rounded-lg my-5 shadow-lg border"
      >
        <h1 className="text-3xl font-bold text-center col-span-2">Sing up</h1>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="appearance-none border border-slate-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formik.errors.name ? (
            <div className="text-red-600">{formik.errors.name}</div>
          ) : null}
        </div>

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
            Sign up
          </button>
        </div>
      </form>
      <div className="text-center mb-5">
        <button
          onClick={handleGoogleSingIn}
          className="text-lg font-bold bg-gray-500 hover:bg-gray-700 text-white flex items-center justify-center gap-1 py-2 px-3 mb-2 rounded w-[220px] mx-auto"
        >
          <FcGoogle /> Sign up with google
        </button>
        <p>
          Already have an account? Please{" "}
          <Link to="/login" className="text-lg font-bold text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
