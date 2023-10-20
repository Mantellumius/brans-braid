import { FC } from 'react';
import cls from './Footer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

export const Footer: FC<Props> = observer(({ className }) => {
	const { navigationStore } = useRootStore();
	const items = [`${navigationStore.items.length} items`, `${navigationStore.actionMultiplier}`];
	return (
		<footer className={classNames(cls.root, {}, [className])}>
			{items.filter(Boolean).map(item => 
				<span key={item} className={cls.root__item}>{item}</span>
			)}
			<Link to={'/explorer'} className={cls.root__item}>
				Explorer
			</Link>
		</footer>
	);
});

interface Props {
	className?: string
}
