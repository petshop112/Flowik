import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../components/ui/pagination";
import { CircleUserRound, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

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
        const res = await fetch(
          "https://petshop-db4w.onrender.com/user/getAllUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    <div className="flex-col justify-start items-start text-white p-4">
      <h3 className="text-2xl mb-1">Dashboard</h3>
      <hr className="mb-3" />
      <div className="flex items-center mt-3 mb-6">
        <span>
          <CircleUserRound />
        </span>
        <h1 className="ml-2 text-sm" data-test="dashboard-welcome-user">
          Welcome, {userName}
        </h1>
      </div>

      <h2 className="mb-3 font-bold text-lg">Usuarios Registrados</h2>
      {loading && <p className="text-blue-400" data-test="loading-users">Cargando usuarios...</p>}
      {error && <p className="text-red-400" data-test="error-users">{error}</p>}

      <input
        data-test="user-search-input"
        type="text"
        placeholder="Buscar por nombre, apellido o email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 rounded-md border border-gray-300 text-azure w-full max-w-md"
      />

      <Table>
        <TableCaption>Lista de usuarios de la base de datos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">ID</TableHead>
            <TableHead className="text-white">Nombre</TableHead>
            <TableHead className="text-white">Apellido</TableHead>
            <TableHead className="text-white">Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium" data-test="user-id">
                {user.id}
              </TableCell>
              <TableCell data-test="user-firstName">{user.firstName}</TableCell>
              <TableCell data-test="user-lastName">{user.lastName}</TableCell>
              <TableCell data-test="user-email">{user.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination className="mt-4">
        <PaginationContent>
          {/* Ir a la primera página */}
          <PaginationItem>
            <PaginationLink
              onClick={() => setCurrentPage(1)}
              data-test="pagination-first"
              size="default"
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              <ChevronsLeft className="w-4 h-4" />
            </PaginationLink>
          </PaginationItem>

          {/* Página anterior */}
          <PaginationItem>
            <PaginationPrevious
              data-test="pagination-prev"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {/* Página actual */}
          <PaginationItem>
            <span
              className="px-3 text-sm text-white"
              data-test="pagination-current"
            >{`Página ${currentPage} de ${totalPages}`}</span>
          </PaginationItem>

          {/* Página siguiente */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>

          {/* Ir a la última página */}
          <PaginationItem>
            <PaginationLink
              data-test="pagination-last"
              onClick={() => setCurrentPage(totalPages)}
              size="default"
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              <ChevronsRight className="w-4 h-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Dashboard;
