
import { useFetch } from './hooks/useFetch.ts';

import './App.css'
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"

type User = {
  id: number;
  name: string;
  email: string;
};

function App() {

  const { data, loading, error } = useFetch<User[]>('https://jsonplaceholder.typicode.com/users');
  return (
    <>
      <Card className="w-fit p-4 bg-amber-500">
        <h1>Misino Mascotas</h1>
        <br />
        <Button>The button to check if shadcn is working</Button>
      </Card>





      <div className='App'>
        <h1 className='text-3x1 font-semibold mb-6'>Usuario de la API</h1>

        {loading && <p className='text-blue-500'>Cargando usuario...</p>}
        {error && <p className='text-red-500'>{error}</p>}
        {data && (
          <ul className='space-y-2'>
            {data.map((user) => (
              <li key={user.id} className="border p-2 rounded bg-white hover:bg-gray-100 transition">
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default App
