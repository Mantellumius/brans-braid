import { FC } from 'react';
import { useRootStore } from 'stores/RootStore';
import { Tag } from './Tag';
import { Accordion, AccordionItem } from 'shared/ui/Accordion';
import { observer } from 'mobx-react';

export const TagsList: FC = observer(() => {
    const { tagsExplorerStore } = useRootStore();
    return (
        <Accordion title='Filter By Tags'>
            {tagsExplorerStore.categoriesWithTags
                .filter((categoryWithTags) => categoryWithTags.tags.length !== 0)
                .map((categoryWithTags) => (
                    <AccordionItem 
                        title={`${categoryWithTags.category.name} - ${categoryWithTags.tags.length}`}
                        key={categoryWithTags.category.id} 
                        disabled={categoryWithTags.tags.length === 0}
                    >
                        {categoryWithTags.tags.map((tag) => (<Tag key={tag.id} tag={tag}/>))}
                    </AccordionItem>
                ))}
        </Accordion>
    );
});
