import { FC, useEffect } from 'react';
import cls from './Files.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Item } from './Item';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { open as openFile } from '@tauri-apps/api/dialog';

export const Files: FC<Props> = observer(({ className, path, open: openFolder }) => {
	const { fileExplorerStore } = useRootStore();
	useEffect(() => {
		fileExplorerStore.read(path);
	}, [path]);
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<ul className={classNames(cls.root__list)}>
				{
					fileExplorerStore.items.slice(0, 1000).map((item, i) => 
						<Item autoFocus={i === 0 && !fileExplorerStore.query} 
							key={item.path} 
							index={i}
							item={item}
							openFolder={openFolder}
							openFile={openFile}/>
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
