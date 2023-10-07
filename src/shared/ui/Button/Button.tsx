import { FC } from 'react';
import cls from './Button.module.scss';
import classNames from 'shared/lib/classNames/classNames';

export const Button: FC<Props> = ({ className, ...props }) => {
	return (
		<button className={classNames(cls.root, {}, [className])} {...props}>
			
		</button>
	);
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string
}
