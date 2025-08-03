import { useFetch } from '../../hooks/useFetch.ts';

type User = {
    id: number;
    name: string;
    email: string;
};

const Home = () => {

    const { data, loading, error } = useFetch<User[]>('https://jsonplaceholder.typicode.com/users');
    return (
        <>
            <div className='App bg-gray-600 rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12 mx-auto"'>
                <h1 className='text-3x1 text-white font-bold mb-6'>Usuario de la API</h1>

                {loading && <p className='text-blue-500'>Cargando usuario...</p>}
                {error && <p className='text-red-500'>{error}</p>}
                {data && (
                    <ul className='space-y-2'>
                        {data.map((user) => (
                            <li key={user.id} className="border p-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-100 transition">
                                <strong>{user.name}</strong> - {user.email}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>

    )
}

export default Home
