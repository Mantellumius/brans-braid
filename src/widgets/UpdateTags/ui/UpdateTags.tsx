import { FC, useEffect, useState } from 'react';
import cls from './UpdateTags.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import { Folder, Tag } from 'bindings/';
import { Input } from 'shared/ui/Input';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { Accordion, AccordionItem } from 'shared/ui/Accordion';

export const UpdateTags: FC<Props> = observer(({ className }) => {
	const { navigationStore, tagsExplorerStore } = useRootStore();
	const [folderTagIds, setFolderTagIds] = useState<number[]>([]);
	const [folder, setFolder] = useState<Folder | null>(null);
	const handleChange = (tag: Tag) => {
		const newTagIds = folderTagIds.includes(tag.id) ? 
			folderTagIds.filter(id => tag.id !== id) :
			[...folderTagIds, tag.id];
		setFolderTagIds(newTagIds);
		if (!folder) {
			ipcInvoke<Folder>('get_or_create_folder', {path: navigationStore.selectedItem.path})
				.then((folder) => {
					setFolder(folder);
					ipcInvoke('update_folder_tags', {folderId: folder.id, tags: newTagIds});	
				});
		} else {
			ipcInvoke('update_folder_tags', {folderId: folder.id, tags: newTagIds});
		}
		return newTagIds;
	};
	useEffect(() => {
		(async () => {
			try {
				const folder = await ipcInvoke<Folder>('get_folder_by_path', {path: navigationStore.selectedItem.path});
				if (!folder) return;
				setFolder(folder);
				const folderTags = await ipcInvoke<Tag[]>('get_folder_tags', {folderId: folder.id});
				setFolderTagIds(folderTags.map(t => t.id));
			} catch (e) {
				setFolderTagIds([]);
				setFolder(null);
			}
		})();
	}, [navigationStore.selectedItem, navigationStore.selectedIndex]);
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Accordion title='Update Tags'>
				{tagsExplorerStore.categoriesWithTags
					.filter((categoryWithTags) => categoryWithTags.tags.length !== 0)
					.map((categoryWithTags) => (
						<AccordionItem 
							title={`${categoryWithTags.category.name} - ${categoryWithTags.tags.length}`}
							key={categoryWithTags.category.id} 
						>
							{categoryWithTags.tags.map((tag) => (
								<li key={tag.id} className={cls.root__tag}>
									<Input checked={folderTagIds.includes(tag.id)} 
										onChange={handleChange.bind(null, tag)} 
										type='checkbox'/>
									{tag.name}
								</li>
							))}
						</AccordionItem>
					))}
			</Accordion>
		</div>
	);
});
UpdateTags.displayName = 'UpdateTags';
interface Props {
	className?: string
}
