import { FC } from 'react';
import classes from './ExplorerItem.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { ExplorerItem as ExplorerItemType } from 'widgets/Explorer/types/ExplorerItem';
import FolderIcon  from 'assets/icons/folder.svg';
import FileIcon  from 'assets/icons/file.svg';
import { Button } from 'shared/ui/Button/Button';

export const ExplorerItem: FC<Props> = ({ className, item, read_dir }) => {
	return (
		<li className={classNames(classes.root, {}, [className])}>
			{
				<Button onClick={read_dir.bind(null, item.path)} disabled={!item.is_folder}>
					{
						item.is_folder ?
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
	item: ExplorerItemType,
	read_dir: (path: string) => void,
}
