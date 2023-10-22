import { FC, useMemo } from 'react';
import cls from './Item.module.scss';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const ActiveNumber: FC<Props> = observer(({ index, isSelected }) => {
	const {navigationStore} = useRootStore();
	const number = useMemo(() => {
		if (isSelected) return `${index + 1}`;
		return Math.abs(index - navigationStore.selectedIndex).toString();
	}, [navigationStore.selectedIndex]);
	
	return (
		<span className={cls.root__item__num}>{number}</span>
	);
});
ActiveNumber.displayName = 'ActiveNumber';
interface Props {
	index: number,
	isSelected: boolean,
}
