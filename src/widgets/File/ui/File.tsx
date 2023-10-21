import { FC, memo } from 'react';
import cls from './File.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import FileIcon  from 'assets/icons/file.svg';
import { Icon } from 'shared/ui/Icon/Icon';
import { Item } from 'bindings/';
import autoScaleConvert from 'shared/lib/autoScaleConvert/autoScaleConvert';

export const File: FC<Props> = memo(({ className, item }) => {
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<div className={cls.root__name}>
				<Icon icon={FileIcon} width={25} height={25}/> 
				{item.name}
			</div>
			<div className={cls.root__metadata}>
				{autoScaleConvert(item.size)}
			</div>
		</div>
	);
});
File.displayName = 'File';
interface Props {
	className?: string,
	item: Item,
}
