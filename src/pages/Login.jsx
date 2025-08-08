import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = React.useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email: email,
        password: password,
      });
      console.log(response.data);

      const token = response.data.token;
      const user = response.data.user;
      console.log(response.data.token);
      console.log(response.data.user);
      if (token && user) {
        login(user, token);
      }

      if (token) {
        toast.success("Login successful");
        navigate("/librarian");
        localStorage.setItem("token", token);
      } else {
        toast.error("Login failed, please try again");
      }
    } catch (error) {
      toast.error("Login failed, please try again");
    }
  }

  return (
    <>
      <div className="login-container flex flex-col items-center justify-center min-h-screen ">
        <div className="login-form bg-white  sm:p-6 md:p-8 xl:p-10 rounded shadow w-full max-w-sm md:min-w-xl lg:min xl:min-w-xl xl:max-h-[400px] border-primary">
          <div className="text-center mb-2 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-blue-600">
              Book Nest Library
            </h1>
          </div>
          <form
            onSubmit={handleLogin}
            action="loginForm"
            className="flex flex-col gap-4 p-3 rounded h-auto items-center justify-center"
          >
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="email"
                className="block text-xl font-bold text-primary text-left py-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@gmail.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-blue-500 text-xl text-primary"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="password"
                className="block text-xl font-bold text-primary text-left py-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-blue-500 text-xl text-primary"
              />
            </div>
            <div className="flex items-center justify-center mb-7 mt-4 w-full">
              <button
                type="submit"
                className="w-full sm:w-[120px] btn-popout bg-secondary text-white font-semibold rounded-md px-4 py-2 hover:bg-accent focus:outline-none focus:ring-offset-2 transition duration-200 justify-center items-center shadow-md mb-5 "
              >
                <span>Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
