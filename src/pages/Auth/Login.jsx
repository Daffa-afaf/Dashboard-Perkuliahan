import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Layouts/Components/atoms/Card";
import Input from "../Layouts/Components/atoms/Input";
import Heading from "../Layouts/Components/atoms/Heading";
import Label from "../Layouts/Components/atoms/Label";
import Button from "../Layouts/Components/atoms/Button";
import Link from "../Layouts/Components/atoms/Link";
import Form from "../Layouts/Components/atoms/Form";
import { login } from "../../Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      toastSuccess("Login berhasil!");
      navigate("/admin/dashboard");
    } catch (err) {
      toastError(err.message || "Email atau password salah!");
    }
  };

  return (
    <Card>
      <Heading as="h2">Login</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>
          <Link href="#" className="text-sm">Lupa password?</Link>
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun? <Link href="/register">Daftar</Link>
      </p>
    </Card>
  );
};

export default Login;
