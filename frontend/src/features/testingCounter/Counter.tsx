import type { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./counterSlice";
import { Button } from "../../components/ui/button";

export const Counter = () => {
  const count = useSelector((state: RootState)=> state.counter.value);
  const dispatch = useDispatch();

  return (
  <div>
    <Button onClick={()=>dispatch(increment())}>+</Button>
    <span className="mx-3">{count}</span>
    <Button onClick={()=>dispatch(decrement())}>-</Button>
    </div>);
};
