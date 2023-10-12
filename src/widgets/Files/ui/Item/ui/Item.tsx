import { FC, useEffect, useMemo, useRef } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Folder } from 'widgets/Folder';
import { File } from 'widgets/File';
import { ExplorerItem } from 'widgets/Files';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Item: FC<Props> = observer(({ className, item, index }) => {
	const { navigationStore, explorerStore } = useRootStore();
	const ref = useRef<HTMLButtonElement>(null);
	const num = useMemo(() => {
		if (navigationStore.selectedIndex === -1) return '';
		if (navigationStore.selectedIndex === index) return `${index + 1}`;
		return Math.abs((index  ?? 0) - navigationStore.selectedIndex);
	}, [index, navigationStore.selectedIndex]);
	useEffect(() => {
		if (navigationStore.selectedIndex === index){
			explorerStore.selectedItem = item;
			ref.current?.scrollIntoView();
		}
	},[navigationStore.selectedIndex, index]);
	return (
		<button data-index={index}
			className={classNames(cls.root, {[cls.root_focused]: navigationStore.selectedIndex === index}, [className])}
			onClick={() => navigationStore.select(index)}
			onDoubleClick={() => explorerStore.open()}
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
