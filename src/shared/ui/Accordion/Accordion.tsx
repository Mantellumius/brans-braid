import { FC, PropsWithChildren } from 'react';
import cls from './Accordion.module.scss';
import classNames from 'shared/lib/classNames/classNames';

export const Accordion: FC<Props> = ({ className, children }) => {
	return (
		<div className={classNames(cls.root, {}, [className])}>
			{children}
		</div>
	);
};

interface Props extends PropsWithChildren {
	className?: string
}
