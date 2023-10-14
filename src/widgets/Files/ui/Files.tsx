import { FC } from 'react';
import cls from './Files.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Item } from './Item';
import { observer } from 'mobx-react';
import { Item as ExplorerItem } from 'bindings/';

export const Files: FC<Props> = observer(({ className, items }) => {
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<ul className={classNames(cls.root__list)}>
				{items.slice(0, 999).map((item, i) => 
					<Item key={item.path} 
						index={i}
						item={item}
					/>)}
			</ul>
		</div>
	);
});

interface Props {
	className?: string;
	items: ExplorerItem[];
}
