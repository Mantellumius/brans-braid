import { FC, useRef } from 'react';
import cls from './AutoCompleteInput.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Input } from 'shared/ui/Input';

export const AutoCompleteInput: FC<Props> = ({ className, value, onChange, setValue, autocompleteOptions = [], ...props }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<div className={classNames(cls.root)}>
			<Input ref={inputRef}
				onChange={onChange}
				className={className}
				value={value}
				autoFocus
				{...props}
			/>
			<div className={cls.root__options}>
				{autocompleteOptions.filter(option => option.toLowerCase().startsWith(value.toLowerCase()))
					.map((option, i) => 
						<span tabIndex={i}
							onClick={() => {
								setValue(option);
								inputRef.current?.focus();
							}} 
							key={option}>
							{option}
						</span>
					)} 
			</div>
		</div>
	);
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement>{
	className?: string,
	autocompleteOptions?: string[],
	value: string,
	setValue: (value: string | number) => void;
}
