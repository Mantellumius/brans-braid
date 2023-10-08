import { FC } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { ExplorerItem } from 'widgets/FileExplorer';
import { Folder } from 'widgets/Folder';
import { File } from 'widgets/File';
import { OpenDialogOptions } from '@tauri-apps/api/dialog';

export const Item: FC<Props> = ({ className, item, openFolder, openFile }) => {
	return (
		<li className={classNames(cls.root, {}, [className])}>
			{
				item.is_dir ? 
					<Folder item={item} open={openFolder} className={cls.root__item}/> : 
					<File item={item} open={openFile} className={cls.root__item}/>
			}
		</li>
	);
};

interface Props {
	className?: string,
	item: ExplorerItem,
	openFolder: (path: string) => void;
	openFile: (options?: OpenDialogOptions) => void;
}
