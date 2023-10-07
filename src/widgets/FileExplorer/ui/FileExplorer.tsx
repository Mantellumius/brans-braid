import { FC, useEffect } from 'react';
import cls from './FileExplorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Item } from './Item';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { Button } from 'shared/ui/Button/Button';
import { useNavigate } from 'react-router-dom';

export const FileExplorer: FC<Props> = observer(({ className, path, open }) => {
	const {fileExplorerStore: explorerStore} = useRootStore();
	const navigate = useNavigate();
	useEffect(() => {
		explorerStore.read(path);
	}, [path]);
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<div className={classNames(cls.root__navigation)}>
				<Button onClick={navigate.bind(null, -1)} className={classNames(cls.root__navigation_button)}>&lt;</Button>
				<Button onClick={navigate.bind(null, 1)} className={classNames(cls.root__navigation_button)}>&gt;</Button>
			</div>
			<ul className={classNames(cls.root__list)}>
				{
					explorerStore.items.map(item => <Item key={item.path} 
						item={item} 
						open={open}/>
					)
				}
			</ul>
		</div>
	);
});

interface Props {
	className?: string;
	open: (path: string) => void;
	path: string;
}
