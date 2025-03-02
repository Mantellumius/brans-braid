import { FC, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

export const Portal: FC<Props> = ({ children, element = document.body}) => {
    const layout = document.getElementById('layout'); 
    if (layout)
        return createPortal(children, layout);
    return createPortal(children, element);
};

interface Props extends PropsWithChildren {
	element?: Element
}
