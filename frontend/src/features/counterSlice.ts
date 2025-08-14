import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
    value:number
}

const initialState: CounterState = {
    value:0,
}

export const counterSlice = createSlice({
    name:"counter",
    initialState,
    reducers:{
        increment: (state) =>{
            state.value +=1
        },
        decrement: (state) =>{
            state.value -=1
        },
        incrementBuAmount: (state, action: PayloadAction<number>) =>{
            state.value += action.payload
        }

    }
})

export const { increment, decrement, incrementBuAmount } = counterSlice.actions
export default counterSlice.reducer