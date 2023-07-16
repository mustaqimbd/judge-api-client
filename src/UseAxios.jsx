import { useEffect } from "react";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";

const instance = axios.create({
  baseURL: "https://judge-api.vercel.app",
});
const auth = getAuth();

const useAxios = () => {
  useEffect(() => {
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("AUTH_TOKEN");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        signOut(auth);
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          signOut(auth);
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return [instance];
};

export default useAxios;
