import { FC, useMemo } from 'react';
import cls from './Item.module.scss';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Number: FC<Props> = observer(({ index, isSelected }) => {
	const {navigationStore} = useRootStore();
	const number = useMemo(() => {
		if (isSelected) return `${index + 1}`;
		return Math.abs((index  ?? 0) - navigationStore.selectedIndex).toString();
	}, [navigationStore.selectedIndex, isSelected]);
	
	return (
		<span className={cls.root__item__num}>{number}</span>
	);
});
Number.displayName = 'Number';
interface Props {
	index: number,
	isSelected: boolean
}
