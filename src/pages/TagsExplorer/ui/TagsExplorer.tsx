import { FC, useEffect } from 'react';
import cls from './TagsExplorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Sidebar } from 'widgets/Sidebar';
import { Files } from 'widgets/Files';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { TagsList } from 'widgets/TagsList';

export const TagsExplorer: FC<Props> = observer(({ className }) => {
	const { navigationStore } = useRootStore();
	useEffect(() => {
		navigationStore.historyPush('');
	},[]);
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Sidebar>
				<TagsList />
			</Sidebar>
			<Files />
		</main>
	);
});

interface Props {
	className?: string
}
