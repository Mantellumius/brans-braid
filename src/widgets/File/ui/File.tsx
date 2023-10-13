import { FC } from 'react';
import cls from './File.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import FileIcon  from 'assets/icons/file.svg';
import { Icon } from 'shared/ui/Icon/Icon';
import { Item } from 'bindings/';

export const File: FC<Props> = ({ className, item }) => {
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Icon icon={FileIcon} width={25} height={25}/> 
			{item.name}
		</div>
	);
};

interface Props {
	className?: string,
	item: Item,
}
