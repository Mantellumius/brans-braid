import { FC } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { FileExplorer } from 'widgets/FileExplorer';
import { useSearchParams } from 'react-router-dom';

export const Explorer: FC<Props> = ({ className }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<FileExplorer path={searchParams.get('path') ?? '.'} open={(newPath: string) => setSearchParams({path: newPath})} />	
		</main>
	);
};

interface Props {
	className?: string
}
