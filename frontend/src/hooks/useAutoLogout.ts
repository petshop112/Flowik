import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../app/store';
import { logout } from '../features/auth/authSlice';

const INACTIVITY_TIME = 30 * 60 * 1000;

export function useAutoLogout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dispatch(logout());
        navigate('/login');
      }, INACTIVITY_TIME);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((event) => document.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => document.removeEventListener(event, resetTimer));
    };
  }, [dispatch, navigate]);
}
