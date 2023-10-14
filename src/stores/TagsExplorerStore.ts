import { Category, Item, Tag } from 'bindings/';
import { makeAutoObservable, autorun } from 'mobx';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';

class TagsExplorerStore {
	tags: Tag[];
	categories: Category[];
	items: Item[];
	selectedTags: number[];

	constructor() {
		this.tags = [];
		this.categories = [];
		this.items = [];
		this.selectedTags = [];
		this.fetchTags();
		this.fetchCategories();
		makeAutoObservable(this);
		autorun(async () => {
			const responseFolders = await ipcInvoke<string[]>('filter_by_tags', {tags: this.selectedTags});
			const folders = responseFolders.data;
			const responseItems = await ipcInvoke<Item[]>('get_folders_info', {folders});
			this.items = responseItems.data;
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
		const response = await ipcInvoke<Tag[]>('get_tags');
		this.tags = response.data;
	}

	private async fetchCategories() {
		const response = await ipcInvoke<Category[]>('get_categories');
		this.categories = response.data;
	}
}



export default TagsExplorerStore;