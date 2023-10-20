import { FC } from 'react';
import cls from './Hr.module.scss';
import classNames from 'shared/lib/classNames/classNames';

export const Hr: FC<Props> = ({ className }) => {
	return (
		<hr className={classNames(cls.root, {}, [className])} />
	);
};

interface Props {
	className?: string
}
