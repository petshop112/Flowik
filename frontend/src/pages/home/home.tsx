import Dashboard from "../Dashboard";
import { Counter } from "../../features/testingCounter/Counter";
const Home = () => {
  return (
    <>
      <Dashboard></Dashboard>
      <div className="bg-teal-800" h-500>
        <h1>El contador para ver si redux ta funcionando</h1>
        <Counter />
      </div>
    </>
  );
};

export default Home;
