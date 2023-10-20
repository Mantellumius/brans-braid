import { FC } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Files } from 'widgets/Files';
import { observer } from 'mobx-react';
import { TagsList } from 'widgets/TagsList';
import { UpdateTags } from 'widgets/UpdateTags';
import { Sidebar } from 'widgets/Sidebar';
import { Hr } from 'shared/ui/Hr';

export const Explorer: FC<Props> = observer(({ className }) => {
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Sidebar>
				<TagsList />
				<Hr />
				<UpdateTags />
			</Sidebar>
			<Files />
		</main>
	);
});

interface Props {
	className?: string
}
