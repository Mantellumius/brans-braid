import { FC } from 'react';
import cls from './Path.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useSearchParams } from 'react-router-dom';

export const Path: FC<Props> = ({ className }) => {
	const [searchParams] = useSearchParams();
	return (
		<div className={classNames(cls.root, {}, [className])}>
			{searchParams.get('path')}
		</div>
	);
};

interface Props {
	className?: string
}
