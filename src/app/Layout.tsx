import { Link, Outlet } from 'react-router-dom';
import './styles/index.scss';
import cls from './Layout.module.scss';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from 'shared/ui/Button/Button';
import classNames from 'shared/lib/classNames/classNames';

const Layout = () => { 
	return (
		<div className={classNames(cls.root)}>
			<Outlet />
			<Link to={'explorer/?path=M:\\'}>
				Explorer
			</Link>
			<Button onClick={() => invoke('test')}>
				Test
			</Button>
		</div>
	);
};

export default Layout;
