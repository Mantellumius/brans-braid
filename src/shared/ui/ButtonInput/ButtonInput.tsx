import { FC, useState } from 'react';
import cls from './ButtonInput.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Input } from '../Input';
import { Button } from '../Button/Button';

export const ButtonInput: FC<Props> = ({ className, title, onSubmit, buttonBackground, placeholder}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [text, setText] = useState('');
    const onSubmitBase = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsCreating(false);
        setText('');
        onSubmit(text);
    };
    const onCancel = () => {
        setIsCreating(false);
        setText('');
    };
    return (
        <div onKeyDown={(e) => e.key === 'Escape' && onCancel()} className={classNames(cls.root, {}, [className])}>
            {isCreating ? 
                <form onSubmit={onSubmitBase}>
                    <Input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder}/>
                    <input type='submit' hidden/>
                </form> :
                <Button style={{background: buttonBackground}} 
                    className={cls.root__button} 
                    onClick={() => setIsCreating(true)}>
                    {title}
                </Button>
            }
        </div>
    );
};

interface Props {
	className?: string,
	title: string,
	onSubmit: (text: string) => void,
	placeholder?: string
	buttonBackground?: string,
}
