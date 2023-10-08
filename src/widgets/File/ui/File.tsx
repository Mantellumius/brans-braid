import { FC } from 'react';
import cls from './File.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import FileIcon  from 'assets/icons/file.svg';
import { Icon } from 'shared/ui/Icon/Icon';
import { ExplorerItem } from 'widgets/FileExplorer';
import { Button } from 'shared/ui/Button/Button';
import { OpenDialogOptions } from '@tauri-apps/api/dialog';

export const File: FC<Props> = ({ className, item, open }) => {
	return (
		<Button onClick={() => open({directory: false, multiple: false, title: 'Open file',  defaultPath: item.path })}
			className={classNames(cls.root, {}, [className])}>
			<Icon icon={FileIcon} /> 
			{item.name}
		</Button>
	);
};

interface Props {
	className?: string,
	item: ExplorerItem,
	open: (options?: OpenDialogOptions) => void;
}
