import { FC, useEffect, useRef } from 'react';
import cls from './Search.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { Input } from 'shared/ui/Input';
import { Icon } from 'shared/ui/Icon/Icon';
import SearchIcon from 'assets/icons/search.svg';
import { observer } from 'mobx-react';
import { Loader } from 'shared/ui/Loader/Loader';
import useDebouncedFunction from 'hooks/useDebouncedFunction';

export const Search: FC<Props> = observer(({ className }) => {
	const { searchStore, explorerStore } = useRootStore();
	const inputRef = useRef<HTMLInputElement>(null);
	const debouncedSearch = useDebouncedFunction(
		searchStore.search.bind(searchStore),
		250
	);
	useEffect(() => { searchStore.inputRef = inputRef; },[inputRef]);
	useEffect(() => { debouncedSearch(explorerStore.path); }, [searchStore.query]);
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Input tabIndex={-1}
				ref={inputRef}
				type="text" 
				placeholder="Search"
				value={searchStore.query} 
				onChange={(e) => {
					e.preventDefault();
					e.stopPropagation();
					searchStore.setQuery = e.target.value;
				}}
				className={cls.root__input}
			/>
			{
				searchStore.isSearching ? 
					<Loader/> :
					<Icon icon={SearchIcon}/>
			}
		</div>
	);
});

interface Props {
	className?: string,
}
