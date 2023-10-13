import { useRef } from 'react';

export default function useDebouncedFunction<T extends (...args: never[]) => unknown>(func: T, delay: number) {
	const timeoutRef = useRef<NodeJS.Timeout>();
	return (...args: Parameters<T>) => {
		if (timeoutRef.current)
			clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			func(...args);
		}, delay);
	};
}