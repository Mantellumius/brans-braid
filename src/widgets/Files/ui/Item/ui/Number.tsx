import { FC } from 'react';
import cls from './Item.module.scss';
import { observer } from 'mobx-react';

export const Number: FC<Props> = observer(({ index }) => {
    return (
        <span className={cls.root__item__num}>{index + 1}</span>
    );
});
Number.displayName = 'Number';
interface Props {
	index: number,
}
