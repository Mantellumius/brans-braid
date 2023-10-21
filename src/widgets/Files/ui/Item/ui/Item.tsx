import { FC, useCallback, useEffect, useRef } from 'react';
import cls from './Item.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Folder } from 'widgets/Folder';
import { File } from 'widgets/File';
import { Item as ExplorerItem } from 'bindings/';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { Number } from './Number';

function isInView(element: Element, containerRect: DOMRect) {
	const elementRect = element.getBoundingClientRect();
	return (
		elementRect.top >= containerRect.top &&
		elementRect.left >= containerRect.left &&
		elementRect.bottom <= containerRect.bottom &&
		elementRect.right <= containerRect.right
	);

}
export const Item: FC<Props> = observer(({isSelected, index, item, className, containerRect}) => {
	const { navigationStore, explorerStore } = useRootStore();
	const ref = useRef<HTMLButtonElement>(null);
	const onClick = useCallback(() => navigationStore.select(index), [index]);
	const onDoubleClick = useCallback(() => explorerStore.openSelected(), []);
	useEffect(() => {
		if (isSelected) {
			if (containerRect && isInView(ref.current as Element, containerRect)) return;
			ref.current?.scrollIntoView();
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
				<Number index={index} isSelected={isSelected}/>
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
	containerRect?: DOMRect
}
