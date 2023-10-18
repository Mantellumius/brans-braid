import { FC, useEffect, useState } from 'react';
import cls from './UpdateTags.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import { Folder, Tag } from 'bindings/';
import { Input } from 'shared/ui/Input';
import { Button } from 'shared/ui/Button/Button';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const UpdateTags: FC<Props> = observer(({ className }) => {
	const {navigationStore} = useRootStore();
	const [tags, setTags] = useState<Tag[]>([]);
	const [folderTags, setFolderTags] = useState<number[]>([]);
	const [folder, setFolder] = useState<Folder | null>(null);
	const onConfirm = () => {
		if (!folder) return;
		ipcInvoke('update_folder_tags', {folderId: folder.id, tags: folderTags});	
	};
	useEffect(() => {
		ipcInvoke<Tag[]>('get_tags').then(setTags);
	},[]);
	useEffect(() => {
		(async () => {
			try {
				const folder = await ipcInvoke<Folder>('get_folder_by_path', {path: navigationStore.selectedItem.path});
				if (!folder) return;
				setFolder(folder);
				const folderTags = await ipcInvoke<Tag[]>('get_folder_tags', {folderId: folder.id});
				setFolderTags(folderTags.map(t => t.id));
			} catch (e) {
				setFolderTags([]);
			}
		})();
	}, [navigationStore.selectedItem, navigationStore.selectedIndex]);
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<h4>Update Tags</h4>
			<ul>
				{tags.map(t => (<li key={t.id} className={cls.root__tag}>
					<Input checked={folderTags.includes(t.id)} 
						onChange={() => {
							if (folderTags.includes(t.id))
								setFolderTags(prev => prev.filter(id => t.id !== id));
							else 
								setFolderTags(prev => [...prev, t.id]);
						}} 
						type='checkbox'/>
					{t.name}
				</li>))}
			</ul>
			<Button onClick={onConfirm}>Confirm</Button>
		</div>
	);
});

interface Props {
	className?: string
}
