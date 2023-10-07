import { FC } from 'react';
import classes from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { ExplorerItem as ExplorerItemType } from '../types/ExplorerItem';
import { ExplorerItem } from './Item';

export const Explorer: FC<Props> = ({ className }) => {
	const [items, setItems] = useState<ExplorerItemType[]>([]);
	function readDir(path: string) {
		invoke<ExplorerItemType[]>('read_dir', {path})
			.then((items) => setItems(items))
			.catch(e => console.error('ERROR: ',e));
	}

	return (
		<div className={classNames(classes.root, {}, [className])}>
			<ul>
				{
					items.map(item => <ExplorerItem key={item.path} item={item} read_dir={readDir}/>)
				}
			</ul>
			<button onClick={readDir.bind(null, 'M:\\')}>Read</button>
		</div>
	);
};

interface Props {
	className?: string
}
