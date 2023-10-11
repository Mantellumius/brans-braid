import { FC, useEffect } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Files } from 'widgets/Files';
import { useSearchParams } from 'react-router-dom';
import { open } from '@tauri-apps/api/shell';

export const Explorer: FC<Props> = ({ className }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		setSearchParams({path: 'M:\\'});
	},[]);
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Files
				path={searchParams.get('path')!} 
				openFolder={(newPath: string) => setSearchParams({path: newPath})}
				openFile={open} 
			/>
		</main>
	);
};

interface Props {
	className?: string
}
