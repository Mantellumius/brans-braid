import { FC } from 'react';
import cls from './Footer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Footer: FC<Props> = observer(({ className }) => {
	const { explorerStore: fileExplorerStore, navigationStore: explorerNavigationStore } = useRootStore();
	const items = [`${fileExplorerStore.items.length} items`, `${explorerNavigationStore.actionMultiplier}`];
	return (
		<footer className={classNames(cls.root, {}, [className])}>
			{items.filter(Boolean).map(item => 
				<span key={item} className={cls.root__item}>{item}</span>
			)}
		</footer>
	);
});

interface Props {
	className?: string
}
