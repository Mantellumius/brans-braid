import { FC } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Files } from 'widgets/Files';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'widgets/Search';
import { Path } from 'widgets/Path';

export const Explorer: FC<Props> = ({ className }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	return (
		<main className={classNames(cls.root, {}, [className])}>
			<header className={cls.root__header}>
				<Path />
				<Search />
				{/* <Navigtaion /> */}
			</header>
			<Files
				path={searchParams.get('path') ?? '.'} 
				open={(newPath: string) => setSearchParams({path: newPath})} 
			/>
		</main>
	);
};

interface Props {
	className?: string
}
