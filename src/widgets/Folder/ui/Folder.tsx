import { FC, memo } from 'react';
import cls from './Folder.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import FolderIcon  from 'assets/icons/folder.svg';
import { Icon } from 'shared/ui/Icon/Icon';
import { Item } from 'bindings/';

export const Folder: FC<Props> = memo(({ className, item }) => {
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Icon icon={FolderIcon} width={25} height={25}/>
			{item.name}
		</div>
	);
});
Folder.displayName = 'Folder';
interface Props {
	className?: string,
	item: Item,
}
