import { FC, useEffect } from 'react';
import cls from './TagsExplorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Sidebar } from 'widgets/Sidebar';
import { Files } from 'widgets/Files';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { TagsList } from 'widgets/TagsList';

export const TagsExplorer: FC<Props> = observer(({ className }) => {
	const {tagsExplorerStore, explorerStore} = useRootStore();
	useEffect(() => {
		explorerStore.historyPush('');
	},[]);
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Sidebar>
				<TagsList />
			</Sidebar>
			<Files items={tagsExplorerStore.items}/>
		</main>
	);
});

interface Props {
	className?: string
}
