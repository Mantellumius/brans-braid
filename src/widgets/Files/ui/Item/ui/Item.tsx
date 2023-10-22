import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Folder } from 'widgets/Folder';
import { File } from 'widgets/File';
import { Item as ExplorerItem } from 'bindings/';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { Number } from './Number';
import { ActiveNumber } from './ActiveNumber';

function checkIsInView(element: Element, containerRect: DOMRect) {
	const elementRect = element.getBoundingClientRect();
	return (
		elementRect.top >= containerRect.top &&
		elementRect.left >= containerRect.left &&
		elementRect.bottom <= containerRect.bottom &&
		elementRect.right <= containerRect.right
	);
}

export const Item: FC<Props> = observer(({isSelected, index, item, className, containerRect, totalItems}) => {
	const { navigationStore, explorerStore } = useRootStore();
	const ref = useRef<HTMLButtonElement>(null);
	const onClick = useCallback(() => navigationStore.select(index), [index]);
	const onDoubleClick = useCallback(() => explorerStore.openSelected(), []);
	const isItemInView = useMemo(() => containerRect && ref.current && checkIsInView(ref.current as Element, containerRect), [containerRect, ref.current, isSelected]);
	useEffect(() => {
		if (isSelected && !isItemInView) {
			ref.current?.scrollIntoView({ block: 'nearest' });
		}
	},[isSelected]);
	return (
		<button 
			data-index={index}
			ref={ref}
			className={classNames(cls.root, {[cls.root_focused]: isSelected}, [className])}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
		>
			<li className={cls.root__item}>
				{
					totalItems < 100 ? <ActiveNumber index={index} isSelected={isSelected}/> : 
						<Number index={index} /> 
				}
				{item.isDir ? <Folder item={item} /> : <File item={item} />}
			</li>
		</button>
	);
});
Item.displayName = 'Item';
interface Props {
	className?: string,
	item: ExplorerItem,
	index: number,
	isSelected: boolean,
	containerRect?: DOMRect,
	totalItems: number
}
