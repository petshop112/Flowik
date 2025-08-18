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
import { useEffect, useState } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const Dashboard = () => {
  const userName = sessionStorage.getItem("username");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = sessionStorage.getItem("token");

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError("No token, no info. Please log in");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("https://petshop-db4w.onrender.com/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Error desconocido al obtener usuarios");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1400px] mx-auto">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="bg-slate-100 rounded-full p-3 text-slate-700 shadow-lg">
              <CircleUserRound size={32} />
            </span>
            <div>
              <span className="block text-sm text-slate-500">Bienvenido</span>
              <h1 className="text-xl font-semibold text-slate-900">{userName}</h1>
            </div>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="mb-3 font-bold text-lg text-slate-900">Usuarios Registrados</h2>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="relative w-full max-w-xs">
                <input
                  data-test="user-search-input"
                  type="text"
                  placeholder="Buscar por nombre, apellido o email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {loading && <p className="text-blue-500">Cargando usuarios...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="text-slate-400">
                  Lista de usuarios de la base de datos
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-500 bg-slate-50">ID</TableHead>
                    <TableHead className="text-slate-500 bg-slate-50">Nombre</TableHead>
                    <TableHead className="text-slate-500 bg-slate-50">Apellido</TableHead>
                    <TableHead className="text-slate-500 bg-slate-50">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="font-medium text-slate-900">
                        {user.id}
                      </TableCell>
                      <TableCell className="text-slate-700">{user.firstName}</TableCell>
                      <TableCell className="text-slate-700">{user.lastName}</TableCell>
                      <TableCell className="text-slate-700">{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-center gap-6 border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-300 bg-white hover:bg-slate-100 disabled:cursor-not-allowed"
                aria-label="Anterior"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>

              <div className="flex items-center gap-2 text-sm">
                {[...Array(totalPages || 1)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`h-10 w-10 flex items-center justify-center rounded-full font-semibold transition
                      ${currentPage === i + 1
                        ? "bg-slate-900 text-white shadow"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-300 bg-white hover:bg-slate-100 disabled:cursor-not-allowed"
                aria-label="Siguiente"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                »
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;