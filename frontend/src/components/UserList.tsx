
import { useFetch } from "../hooks/useFetch.ts";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserList() {
  const { data, loading, error } = useFetch<User[]>('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p className="text-blue-500">Cargando usuario...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="font-bold mb-4">Usuario</h2>
      <ul className="space-y-2">
        {data?.map((user) => (
          <li key={user.id} className="border p-2 rounded bg-white hover:bg-gray-100 transition">
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}