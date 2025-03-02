import { FC } from 'react';
import cls from './Header.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Path } from 'widgets/Path';
import { Search } from 'widgets/Search';

export const Header: FC<Props> = ({ className }) => {
    return (
        <header className={classNames(cls.root, {}, [className])}>
            <Path />
            <Search />
            {/* <Navigtaion /> */}
        </header>
    );
};

interface Props {
	className?: string
}
