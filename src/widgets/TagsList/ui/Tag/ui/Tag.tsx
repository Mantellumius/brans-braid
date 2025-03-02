import { FC } from 'react';
import cls from './Tag.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Tag as TagType } from 'bindings/';
import { Input } from 'shared/ui/Input';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';

export const Tag: FC<Props> = observer(({ className, tag }) => {
    const { tagsExplorerStore } = useRootStore();
    return (
        <div className={classNames(cls.root, {}, [className])}>
            <Input onChange={() => tagsExplorerStore.toggleTag(tag)} 
                checked={tagsExplorerStore.selectedTags.includes(tag.id)} 
                type='checkbox'/>
            {tag.name}
        </div>
    );
});

interface Props {
	className?: string;
	tag: TagType;
}
