import { FC, useMemo, useRef } from 'react';
import cls from './Files.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Item } from './Item';
import { observer } from 'mobx-react';
import { useRootStore } from 'stores/RootStore';
import { AskTagPopup } from 'widgets/AskTagPopup';

export const Files: FC<Props> = observer(({ className }) => {
	const { navigationStore } = useRootStore();
	const ref = useRef<HTMLDivElement>(null);
	const rect = useMemo(() => ref.current?.getBoundingClientRect(), [ref.current]);
	return (
		<>
			<div ref={ref} className={classNames(cls.root, {}, [className])}>
				<ul className={classNames(cls.root__list)}>
					{navigationStore.items.slice(0, 999).map((item, i) => 
						<Item
							key={`${item.path}-${i}`} 
							index={i}
							containerRect={rect}
							isSelected={navigationStore.selectedIndex === i}
							item={item}
							totalItems={navigationStore.items.length}
						/>
					)}
				</ul>
			</div>
			<AskTagPopup/>
		</>
	);
});
Files.displayName = 'Files';
interface Props {
	className?: string;
}
