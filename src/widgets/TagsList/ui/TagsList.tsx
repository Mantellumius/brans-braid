import { FC } from 'react';
import { useRootStore } from 'stores/RootStore';
import { Tag } from './Tag';
import { Accordion, AccordionItem } from 'shared/ui/Accordion';

export const TagsList: FC = () => {
	const { tagsExplorerStore } = useRootStore();
	return (
		<Accordion>
			{tagsExplorerStore.categoriesWithTags.map((categoryWithTags) => (
				<AccordionItem 
					title={`${categoryWithTags.category.name} - ${categoryWithTags.tags.length}`}
					key={categoryWithTags.category.id} 
				>
					{categoryWithTags.tags.map((tag) => (<Tag key={tag.id} tag={tag}/>))}
				</AccordionItem>
			))}
		</Accordion>
	);
};
