import { forwardRef } from 'react';
import cls from './Input.module.scss';
import classNames from 'shared/lib/classNames/classNames';

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, ...props }, ref) {
    return (
        <input ref={ref} className={classNames(cls.root, {}, [className])} {...props}>
			
        </input>
    );
});

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string
}
