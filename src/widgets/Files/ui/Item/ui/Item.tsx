import { FC } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Folder } from 'widgets/Folder';
import { File } from 'widgets/File';
import { OpenDialogOptions } from '@tauri-apps/api/dialog';
import { ExplorerItem } from 'widgets/Files';
import { useRootStore } from 'stores/RootStore';

export const Item: FC<Props> = ({ className, item, openFolder, openFile, tabIndex }) => {
	const {contextMenuStore} = useRootStore();
	const onClick = () => item.is_dir ? openFolder(item.path) : openFile();
	return (
		<li tabIndex={tabIndex}
			onContextMenuCapture={() => contextMenuStore.setPath(item.path)} 
			onFocusCapture={() => contextMenuStore.setPath(item.path)}
			onKeyDown={(e) => e.key === 'Enter' && onClick()}
			onClick={onClick}
			className={classNames(cls.root, {}, [className])}>
			{
				item.is_dir ? 
					<Folder item={item} /> : 
					<File item={item} />
			}
		</li>
	);
};

interface Props {
	className?: string,
	item: ExplorerItem,
	openFolder: (path: string) => void;
	openFile: (options?: OpenDialogOptions) => void;
	tabIndex: number,
}
