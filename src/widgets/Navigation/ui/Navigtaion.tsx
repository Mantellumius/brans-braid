import { FC } from 'react';
import cls from './Navigation.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button/Button';
import { useNavigate } from 'react-router-dom';

export const Navigtaion: FC<Props> = ({ className }) => {
	const navigate = useNavigate();
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Button onClick={navigate.bind(null, -1)} 
				className={classNames(cls.root_button)}>
					&lt;
			</Button>
			<Button onClick={navigate.bind(null, 1)} 
				className={classNames(cls.root_button)}>
					&gt;
			</Button>
		</div>
	);
};

interface Props {
	className?: string
}
