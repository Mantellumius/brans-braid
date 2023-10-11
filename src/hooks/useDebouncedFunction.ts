import { useRef } from 'react';

export default function useDebouncedFunction(func: () => void, delay: number) {
	const timeoutRef = useRef<NodeJS.Timeout>();
	return () => {
		if (timeoutRef.current)
			clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			func();
		}, delay);
	};
}