import { FC, PropsWithChildren } from 'react';
import cls from './Accordion.module.scss';
import classNames from 'shared/lib/classNames/classNames';

export const Accordion: FC<Props> = ({ className, children, title }) => {
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<h4 className={cls.root__title}>{title}</h4>
			{children}
		</div>
	);
};

interface Props extends PropsWithChildren {
	className?: string,
	title?: string
}
