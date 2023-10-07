import { FC } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import FolderIcon  from 'assets/icons/folder.svg';
import FileIcon  from 'assets/icons/file.svg';
import { Button } from 'shared/ui/Button/Button';
import { ExplorerItem } from 'widgets/FileExplorer';

export const Item: FC<Props> = ({ className, item, open }) => {
	return (
		<li className={classNames(cls.root, {}, [className])}>
			{
				<Button onClick={open.bind(null, item.path)} disabled={!item.is_dir}>
					{
						item.is_dir ?
							<img src={FolderIcon} alt="folder" width={20} height={20} style={{marginRight: '5px'}}/> :
							<img src={FileIcon} alt="file" width={20} height={20} style={{marginRight: '5px'}}/> 
					}
					{item.name}
				</Button> 
			}
		</li>
	);
};

interface Props {
	className?: string,
	item: ExplorerItem,
	open: (path: string) => void;
}
