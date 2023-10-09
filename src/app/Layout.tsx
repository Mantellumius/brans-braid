import { Outlet } from 'react-router-dom';
import './styles/index.scss';
import cls from './Layout.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Footer } from 'widgets/Footer';
import { Header } from 'widgets/Header';

const Layout = () => { 
	return (
		<div className={classNames(cls.root)}>
			<Header />
			<Outlet />
			<Footer />	
		</div>
	);
};

export default Layout;
