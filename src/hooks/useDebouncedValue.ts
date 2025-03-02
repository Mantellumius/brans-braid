import { useEffect, useRef, useState } from 'react';

export default function useDebouncedValue<T>(initialValue: T, delay = 1000): [T, T, (v: T) => void] {
    const [state, setState] = useState<T>(initialValue);
    const [debouncedState, setDebouncedState] = useState<T>(initialValue);
    const timeoutRef = useRef<number | null>(null);
    useEffect(() => {
        if (timeoutRef.current) 
            clearTimeout(timeoutRef.current);
        timeoutRef.current = Number(setTimeout(() => {
            setDebouncedState(state);
        }, delay));
        () => {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        };
    }, [state]);
    return [state, debouncedState, setState];
}