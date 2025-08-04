import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../components/ui/table";
  import { CircleUserRound } from "lucide-react";
  import React, { useEffect, useState } from "react";

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  
  const Dashboard = () => {
    const userName = localStorage.getItem("username");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      fetch("https://petshop-db4w.onrender.com/user/getAllUsers")
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener los usuarios");
          return res.json();
        })
        .then((data: User[]) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
          setLoading(false);
        });
    }, []);
  
    return (
      <div className="flex-col justify-start items-start text-white p-4">
        <h3 className="text-2xl mb-1">Dashboard</h3>
        <hr className="mb-3" />
        <div className="flex items-center mt-3 mb-6">
          <span>
            <CircleUserRound />
          </span>
          <h1 className="ml-2 text-sm">Welcome, {userName}</h1>
        </div>
  
        <h2 className="mb-3 font-bold text-lg">Usuarios Registrados</h2>
        {loading && <p className="text-blue-400">Cargando usuarios...</p>}
        {error && <p className="text-red-400">{error}</p>}
  
        <Table >
          <TableCaption>Lista de usuarios en la base de datos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">ID</TableHead>
              <TableHead className="text-white">Nombre</TableHead>
              <TableHead className="text-white">Apellido</TableHead>
              <TableHead className="text-white">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default Dashboard;