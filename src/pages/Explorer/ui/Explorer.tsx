import { FC, useEffect } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Files } from 'widgets/Files';
import { useSearchParams } from 'react-router-dom';

export const Explorer: FC<Props> = ({ className }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		setSearchParams({path: 'M:\\'});
	},[]);
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Files
				path={searchParams.get('path')!} 
				open={(newPath: string) => setSearchParams({path: newPath})} 
			/>
		</main>
	);
};

interface Props {
	className?: string
}
