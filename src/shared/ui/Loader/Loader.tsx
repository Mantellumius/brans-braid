import { FC } from 'react';
import cls from './Loader.module.scss';
import classNames from 'shared/lib/classNames/classNames';

export const Loader: FC<Props> = ({ className }) => {
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>	
		</div>
	);
};

interface Props {
	className?: string
}
