import { FC } from 'react';
import cls from './Search.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { Input } from 'shared/ui/Input';
import { Icon } from 'shared/ui/Icon/Icon';
import SearchIcon from 'assets/icons/search.svg';
import { Loader } from 'shared/ui/Loader/Loader';
import { observer } from 'mobx-react';

export const Search: FC<Props> = observer(({ className }) => {
	const { fileExplorerStore } = useRootStore();
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Input type="text" 
				placeholder="Search" 
				onChange={e => fileExplorerStore.search(e.target.value)}
				className={cls.root__input}
			/>
			{
				fileExplorerStore.isSearching ? 
					<Loader/> :
					<Icon icon={SearchIcon}/>
			}
		</div>
	);
});

interface Props {
	className?: string,
}
