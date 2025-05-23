import { useState, useContext, useCallback } from "react";
import { contextApp } from "@/context";
import toast, { Toaster } from "react-hot-toast";

const FormLogin = () => {
  const { setisLogin } = useContext(contextApp);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const formdata = new FormData();
      formdata.append("username", username);
      formdata.append("password", password);
      const res = await fetch("/api/validate", {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();
      if (data.login) {
        toast.success("Login Success");
        setisLogin(true);
        localStorage.setItem("login", "true");
      } else {
        toast.error(data.message);
        console.log("error");
      }
    },
    [username, password]
  );
  return (
    <>
      <Toaster />
      <form
        className="bg-white shadow-lg w-[50%] h-max p-8 rounded-lg flex flex-col gap-6 border border-gray-200"
        onSubmit={handleSubmit}
      >
        <h2 className="text-gray-800 text-2xl font-bold mb-4 text-center">
          Admin Login
        </h2>
        <label className="text-gray-700 font-medium">
          Username
          <input
            type="text"
            className="block w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="text-gray-700 font-medium">
          Password
          <input
            type="password"
            className="block w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </>
  );
};

export default FormLogin;
