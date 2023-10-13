import { FC, useEffect, useMemo, useRef } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Folder } from 'widgets/Folder';
import { File } from 'widgets/File';
import { ExplorerItem } from 'widgets/Files';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Item: FC<Props> = observer(({ className, item, index }) => {
	const { explorerStore } = useRootStore();
	const ref = useRef<HTMLButtonElement>(null);
	const num = useMemo(() => {
		if (explorerStore.selectedIndex === -1) return '';
		if (explorerStore.selectedIndex === index) return `${index + 1}`;
		return Math.abs((index  ?? 0) - explorerStore.selectedIndex);
	}, [index, explorerStore.selectedIndex]);
	useEffect(() => {
		if (explorerStore.selectedIndex === index) {
			ref.current?.scrollIntoView();
		}
	},[explorerStore.selectedIndex, index]);
	return (
		<button data-index={index}
			className={classNames(cls.root, {[cls.root_focused]: explorerStore.selectedIndex === index}, [className])}
			onClick={() => explorerStore.select(index)}
			onDoubleClick={() => explorerStore.openSelected()}
			ref={ref}
		>
			<li className={cls.root__item}>
				{num && <span className={cls.root__item__num}>{num}</span>}
				{item.is_dir ? <Folder item={item} /> : <File item={item} />}
			</li>
		</button>
	);
});

interface Props {
	className?: string,
	item: ExplorerItem,
	index: number,
}
