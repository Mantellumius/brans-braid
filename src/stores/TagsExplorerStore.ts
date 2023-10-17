import { Category, Item, Tag } from 'bindings/';
import { makeAutoObservable, autorun } from 'mobx';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import NavigationStore from './NavigationStore';

class TagsExplorerStore {
	tags: Tag[];
	categories: Category[];
	items: Item[] | null;
	selectedTags: number[];

	constructor(
		private readonly navigationStore: NavigationStore
	) {
		this.tags = [];
		this.categories = [];
		this.items = [];
		this.selectedTags = [];
		this.fetchTags();
		this.fetchCategories();
		makeAutoObservable(this);
		autorun(async () => {
			if (this.selectedTags.length === 0) {
				this.items = null;
			} else {
				const folders = await ipcInvoke<string[]>('filter_by_tags', { tags: this.selectedTags });
				this.items = await ipcInvoke<Item[]>('get_folders_info', { folders });
			}
			this.navigationStore.setItems = this.items;
		});
	}

	get categoriesWithTags() {
		return this.categories.map(category => ({
			category: category,
			tags: this.tags.filter(tag => tag.categoryId === category.id)
		}));
	}

	toggleTag(tag: Tag) {
		if (this.selectedTags.includes(tag.id))
			this.selectedTags = this.selectedTags.filter(t => t !== tag.id);
		else
			this.selectedTags.push(tag.id);
	}

	private async fetchTags() {
		this.tags = await ipcInvoke<Tag[]>('get_tags');
	}

	private async fetchCategories() {
		this.categories = await ipcInvoke<Category[]>('get_categories');
	}
}



export default TagsExplorerStore;