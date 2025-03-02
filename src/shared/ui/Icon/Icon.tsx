import { FC } from 'react';

export const Icon: FC<Props> = ({ className, icon, alt, width = 20, height = 20 }) => {
    return (
        <img src={icon} alt={alt} width={width} height={height} className={className} />
    );
};

interface Props {
	className?: string,
	icon: string,
	width?: string | number,
	height?: string | number,
	alt: string
}
