import { FC } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { FileExplorer } from 'widgets/FileExplorer';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'widgets/Search';

export const Explorer: FC<Props> = ({ className }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Search />
			<FileExplorer 
				path={searchParams.get('path') ?? '.'} 
				open={(newPath: string) => setSearchParams({path: newPath})} 
			/>	
		</main>
	);
};

interface Props {
	className?: string
}
