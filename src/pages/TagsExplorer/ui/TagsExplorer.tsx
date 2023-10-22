import { FC } from 'react';
import cls from './TagsExplorer.module.scss';
import classNames from 'shared/lib/classNames/classNames';
import { Accordion, AccordionItem } from 'shared/ui/Accordion';
import { useRootStore } from 'stores/RootStore';
import { observer } from 'mobx-react';
import { Button } from 'shared/ui/Button/Button';
import close from 'assets/icons/close.svg';
import { Icon } from 'shared/ui/Icon/Icon';
import { ButtonInput } from 'shared/ui/ButtonInput/ButtonInput';

export const TagsExplorer: FC<Props> = observer(({ className }) => {
	const { tagsExplorerStore } = useRootStore();
	return (
		<div className={classNames(cls.root, {}, [className])}>
			<Accordion title='Explore Tags'>
				{tagsExplorerStore.categoriesWithTags
					.map((categoryWithTags) => (
						<AccordionItem 
							title={`${categoryWithTags.category.name} - ${categoryWithTags.tags.length}`}
							key={categoryWithTags.category.id} 
						>
							{categoryWithTags.tags.map((tag) => (
								<div key={tag.id} className={cls.root__item}>
									{tag.name}
									<Button onClick={() => tagsExplorerStore.deleteTag(tag.id)}>
										<Icon className={cls.root__item__icon} alt='close' icon={close}/>
									</Button>
								</div>
							))}
							<ButtonInput buttonBackground='var(--success-800)' 
								title={'Add Tag'} 
								onSubmit={(tagName) => tagsExplorerStore.addTag(tagName, categoryWithTags.category.id)}
								placeholder={'Tag Name'}
							/>
						</AccordionItem>
					))}
			</Accordion>
			<ButtonInput buttonBackground='var(--success-800)' 
				title={'Add Category'} 
				onSubmit={(categoryName) => tagsExplorerStore.addCategory(categoryName)}
				placeholder={'Category Name'}
			/>
		</div>
	);
});

interface Props {
	className?: string
}
