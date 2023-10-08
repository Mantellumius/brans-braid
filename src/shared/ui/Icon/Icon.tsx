import { FC } from 'react';

export const Icon: FC<Props> = ({ icon, width = 20, height = 20 }) => {
	return (
		<img src={icon} alt="" width={width} height={height} />
	);
};

interface Props {
	className?: string,
	icon: string,
	width?: string | number,
	height?: string | number,
}
