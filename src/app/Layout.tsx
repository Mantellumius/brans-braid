import './styles/index.scss';
import { Outlet } from 'react-router-dom';
import cls from './Layout.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Footer } from 'widgets/Footer';
import { Header } from 'widgets/Header';
import { Titlebar } from 'widgets/Titlebar';

const Layout = () => { 
    return (
        <div id='layout' className={classNames(cls.root)}>
            <Titlebar />
            <Header />
            <Outlet />
            <Footer />	
        </div>
    );
};

export default Layout;
	