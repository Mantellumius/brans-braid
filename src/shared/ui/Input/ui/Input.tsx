import { FC } from 'react';
import cls from './Input.module.scss';
import classNames from 'shared/lib/classNames/classNames';

export const Input: FC<Props> = ({ className, ...props }) => {
	return (
		<input className={classNames(cls.root, {}, [className])} {...props}>
			
		</input>
	);
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string
}
