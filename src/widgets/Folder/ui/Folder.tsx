import { FC } from 'react';
import cls from './Folder.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import FolderIcon  from 'assets/icons/folder.svg';
import { Icon } from 'shared/ui/Icon/Icon';
import { ExplorerItem } from 'widgets/Files';
import { Button } from 'shared/ui/Button/Button';

export const Folder: FC<Props> = ({ className, item, open }) => {
	return (
		<Button onClick={() => {
			open.bind(null, item.path)();
		}} className={classNames(cls.root, {}, [className])}>
			<Icon icon={FolderIcon}/>
			{item.name}
		</Button>
	);
};

interface Props {
	className?: string,
	item: ExplorerItem,
	open: (path: string) => void;
}
