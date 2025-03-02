import { FC, PropsWithChildren } from 'react';
import cls from './Popup.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { Portal } from 'shared/ui/Portal/Portal';

export const Popup: FC<Props> = observer(({ className, children }) => {
    const { popupStore } = useRootStore();
    if (!popupStore.show) 
        return <></>;
    return (
        <Portal>
            <div onClick={() => popupStore.resolvePopup(null)} className={cls.root__overlay}>
                <div onClick={e => e.stopPropagation()} 
                    className={classNames(cls.root, {}, [className])}>
                    {children}
                </div>
            </div>
        </Portal>
    );
});

interface Props extends PropsWithChildren {
	className?: string
}
