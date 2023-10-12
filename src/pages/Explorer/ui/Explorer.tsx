import { FC } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Files } from 'widgets/Files';

export const Explorer: FC<Props> = ({ className }) => {
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Files />
		</main>
	);
};

interface Props {
	className?: string
}
