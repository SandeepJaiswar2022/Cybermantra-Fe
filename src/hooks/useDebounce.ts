import { useEffect, useState } from "react";

export default function useDebounce<T>(
    value: T,
    delay: number
): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup previous timer whenever value changes
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}