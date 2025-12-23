import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Layouts/Components/atoms/Card";
import Input from "../Layouts/Components/atoms/Input";
import Heading from "../Layouts/Components/atoms/Heading";
import Label from "../Layouts/Components/atoms/Label";
import Button from "../Layouts/Components/atoms/Button";
import Link from "../Layouts/Components/atoms/Link";
import Form from "../Layouts/Components/atoms/Form";
import { register, getAllUsers } from "../../Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toastError("Password minimal 6 karakter!");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toastError("Password tidak cocok!");
      return;
    }

    try {
      // Fetch all users to generate next sequential ID
      const usersRes = await getAllUsers();
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const maxId = users.reduce((max, u) => {
        const userId = parseInt(u.id) || 0;
        return userId > max ? userId : max;
      }, 0);
      const nextId = String(maxId + 1);

      // Register with sequential ID
      await register({ 
        id: nextId,
        email: formData.email, 
        password: formData.password,
        name: formData.email.split('@')[0],
        role: 'user',
        permissions: ['read']
      });
      toastSuccess("Registrasi berhasil! Silakan login.");
      navigate("/");
    } catch (err) {
      toastError("Registrasi gagal!");
    }
  };

  return (
    <Card>
      <Heading as="h2">Register</Heading>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Masukkan email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Konfirmasi password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full">Register</Button>
      </Form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Sudah punya akun? <Link href="/login">Login</Link>
      </p>
    </Card>
  );
};

export default Register;
