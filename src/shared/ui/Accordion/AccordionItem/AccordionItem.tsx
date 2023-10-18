import { FC, PropsWithChildren, useState } from 'react';
import cls from './AccordionItem.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button/Button';
import up from 'assets/icons/up.svg';

export const AccordionItem: FC<Props> = ({ className, title, children, disabled = false }) => {
	const [collapsed, setCollapsed] = useState(true);
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Button className={cls.root__button} 
				onClick={() => setCollapsed(prev => !prev)} 
				disabled={disabled}>
				{collapsed ? 
					<img width={30} height={30} src={up} alt='collapsed' className={cls.root__icon} style={{transform: 'rotate(-90deg)'}}/> :
					<img width={30} height={30} src={up} alt='expanded' className={cls.root__icon} style={{transform: 'rotate(0deg)'}}/> 
				}
				{title}
			</Button>
			<div className={cls.root__content}>
				{!collapsed && children}
			</div>
		</div>
	);
};

interface Props extends PropsWithChildren {
	className?: string,
	title: string,
	disabled?: boolean,
}
