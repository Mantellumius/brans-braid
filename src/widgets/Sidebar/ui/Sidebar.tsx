import { FC } from 'react';
import cls from './Sidebar.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Sidebar: FC<Props> = observer(({ className, children }) => {
	const {tagsExplorerStore} = useRootStore();
	return (
		<div className={classNames(cls.root, {[cls.root_expanded]: tagsExplorerStore.sidebarExpanded}, [className])}>
			{children}
		</div>
	);
});

interface Props {
	className?: string,
	children?: React.ReactNode[]
}
