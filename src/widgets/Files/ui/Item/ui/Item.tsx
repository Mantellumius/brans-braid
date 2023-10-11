import { FC, useMemo } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Folder } from 'widgets/Folder';
import { File } from 'widgets/File';
import { OpenDialogOptions } from '@tauri-apps/api/dialog';
import { ExplorerItem } from 'widgets/Files';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Item: FC<Props> = observer(({ className, item, openFolder, openFile, autoFocus, index }) => {
	const {contextMenuStore, explorerNavigationStore } = useRootStore();
	const onClick = () => item.is_dir ? openFolder(item.path) : openFile();
	const num = useMemo(() => {
		if (explorerNavigationStore.selectedIndex === -1) return '';
		if (explorerNavigationStore.selectedIndex === index) return `${index + 1}`;
		return Math.abs((index  ?? 0) - explorerNavigationStore.selectedIndex);
	}, [index, explorerNavigationStore.selectedIndex]);
	return (
		<button data-index={index}
			autoFocus={autoFocus}
			onContextMenuCapture={() => contextMenuStore.setPath(item.path)} 
			onFocusCapture={() => contextMenuStore.setPath(item.path)}
			onKeyDown={(e) => e.key === 'Enter' && onClick()}
			onClick={e => (e.target as HTMLButtonElement).focus()}
			onDoubleClick={onClick}
			className={cls.root}>
			<li className={classNames(cls.root__item, {}, [className])}>
				{num && <span className={cls.root__item__num}>{num}</span>}
				{
				
					item.is_dir ? 
						<Folder item={item} /> : 
						<File item={item} />
				}
			</li>
		</button>
	);
});

interface Props {
	className?: string,
	item: ExplorerItem,
	openFolder: (path: string) => void;
	openFile: (options?: OpenDialogOptions) => void;
	autoFocus?: boolean,
	index?: number,
}
