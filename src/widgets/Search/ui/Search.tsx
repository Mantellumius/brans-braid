import { FC } from 'react';
import classes from './Search.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';

export const Search: FC<Props> = ({ className }) => {
	const {fileExplorerStore} = useRootStore();
	return (
		<div className={classNames(classes.root, {}, [className])}>
			<input type="text" placeholder="Search" onChange={e => fileExplorerStore.search(e.target.value)}/>
		</div>
	);
};

interface Props {
	className?: string,
}
