import { FC } from 'react';
import { useRootStore } from 'stores/RootStore';
import { Tag } from './Tag';
import { Accordion, AccordionItem } from 'shared/ui/Accordion';

export const TagsList: FC = () => {
	const { tagsExplorerStore } = useRootStore();
	return (
		<Accordion>
			<h4>Filter By Tags</h4>
			{tagsExplorerStore.categoriesWithTags.map((categoryWithTags) => (
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
};
