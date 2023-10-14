import { FC } from 'react';
import cls from './Explorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Files } from 'widgets/Files';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Explorer: FC<Props> = observer(({ className }) => {
	const { explorerStore } = useRootStore();
	return (
		<main className={classNames(cls.root, {}, [className])}>
			<Files items={explorerStore.items}/>
		</main>
	);
});

interface Props {
	className?: string
}
