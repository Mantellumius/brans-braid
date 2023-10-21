import { FC, useEffect, useState } from 'react';
import cls from './Titlebar.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { appWindow } from '@tauri-apps/api/window';
import { Button } from 'shared/ui/Button/Button';
import minimize from 'assets/icons/minimize.svg';
import maximize from 'assets/icons/maximize.svg';
import unmaximize from 'assets/icons/unmaximize.svg';
import close from 'assets/icons/close.svg';
import logo from 'assets/icons/logo.png';

export const Titlebar: FC<Props> = ({ className }) => {
	const [isMaximized, setIsMaximized] = useState(false);
	const handleClose = () => {
		appWindow.close();
	};
	const handleMinimize = () => {
		appWindow.minimize();
	};
	const handleMaximize = () => {
		appWindow.toggleMaximize();
		setIsMaximized(prev => !prev);
	};
	useEffect(() => {
		appWindow.onResized(() => {
			appWindow.isMaximized().then(setIsMaximized);
		});
	},[]);
	return (
		<div data-tauri-drag-region className={classNames(cls.root, {}, [className])}>
			<div className={cls.root__logo}>
				<img width={20} height={20} src={logo}/>
				<span>Brans Braid</span>
			</div>
			<div className={cls.root__buttons}>
				<Button className={classNames(cls.root__button, {}, [cls.root__minimize])} onClick={handleMinimize}>
					<img width={20} height={20} src={minimize}/>
				</Button>
				<Button className={classNames(cls.root__button, {}, [cls.root__maximize])} onClick={handleMaximize}>
					{isMaximized ? <img width={16} height={16} src={unmaximize}/> : <img width={10} height={10} src={maximize}/>}
				</Button>
				<Button className={classNames(cls.root__button, {}, [cls.root__close])} onClick={handleClose}>
					<img width={16} height={16} src={close}/>
				</Button>
			</div>
		</div>
	);
};

interface Props {
	className?: string
}
