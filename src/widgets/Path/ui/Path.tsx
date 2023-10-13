import { FC } from 'react';
import cls from './Path.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Path: FC<Props> = observer(({ className }) => {
	const { explorerStore } = useRootStore();
	return (
		<div className={classNames(cls.root, {}, [className])}>
			{explorerStore.path}
		</div>
	);
});

interface Props {
	className?: string
}
