import { FC, useEffect } from 'react';
import cls from './Search.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { Input } from 'shared/ui/Input';
import { Icon } from 'shared/ui/Icon/Icon';
import SearchIcon from 'assets/icons/search.svg';
import { observer } from 'mobx-react';
import { Loader } from 'shared/ui/Loader/Loader';
import useDebouncedValue from 'hooks/useDebouncedValue';

export const Search: FC<Props> = observer(({ className }) => {
	const { fileExplorerStore } = useRootStore();
	const [query, debouncedQuery, setQuery] = useDebouncedValue('');
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		setQuery(e.target.value);
	};
	useEffect(() => {
		fileExplorerStore.search(debouncedQuery);
	},[debouncedQuery, fileExplorerStore]);
	useEffect(() => {
		if (!query) fileExplorerStore.search(query);
	}, [query]);
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Input type="text" 
				placeholder="Search"
				value={query} 
				onChange={onChange}
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
