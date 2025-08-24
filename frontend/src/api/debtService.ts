import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../lib/baseurl';

export type DebtPayload = {
    mount: number,
};

export type DebtPayment = {
    id: number;
    paymentMount: number;
    datePayment: string;
};

export type DebtResponse = {
    debt_date: string;
    mount: number;
    status: string;
    payments: DebtPayment[];
};


export const createDebt = async (
    clientId: number,
    payload: DebtPayload,
    token: string
): Promise<DebtResponse> => {
    try {
        const { data } = await axios.post(
            `${API_BASE_URL}Debt/${clientId}`,
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            }
        );
        return data;
    } catch (err) {
        const e = err as AxiosError;
        console.error('[createDebt] Error:', e.response?.data ?? e.message);
        throw err;
    }
};

export const debtService = {
    createDebt,
};
