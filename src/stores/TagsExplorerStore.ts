import { Category, Item, Tag } from 'bindings/';
import { makeAutoObservable, autorun } from 'mobx';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import NavigationStore from './NavigationStore';
import HotkeysStore from './HotkeysStore';

class TagsExplorerStore {
    tags: Tag[];
    categories: Category[];
    items: Item[] | null;
    selectedTags: number[];
    sidebarExpanded = true;

    constructor(
		private readonly navigationStore: NavigationStore,
		private readonly hotkeysStore: HotkeysStore
    ) {
        this.tags = [];
        this.categories = [];
        this.items = [];
        this.selectedTags = [];
        this.fetchTags();
        this.fetchCategories();
        this.register();
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

    *addCategory(categoryName: string) {
        const id: number = yield ipcInvoke<number>('create_category', { name: categoryName });
        this.categories.push({ id, name: categoryName } as Category);
    }

    *addTag(tagName: string, categoryId: number) {
        const id: number = yield ipcInvoke<number>('create_tag', { name: tagName, categoryId });
        this.tags.push({ id, name: tagName, categoryId } as Tag);
    }

    *deleteTag(tagId: number) {
        yield ipcInvoke('delete_tag', { id: tagId });
        this.tags = this.tags.filter(tag => tag.id !== tagId);
        if (this.selectedTags.includes(tagId))
            this.selectedTags = this.selectedTags.filter(id => id !== tagId);
    }

    private register() {
        this.hotkeysStore.setAction('ctrl+KeyT', this.toggleSidebar.bind(this));
    }

    private toggleSidebar() {
        this.sidebarExpanded = !this.sidebarExpanded;
    }

    private async fetchTags() {
        this.tags = await ipcInvoke<Tag[]>('get_tags');
    }

    private async fetchCategories() {
        this.categories = await ipcInvoke<Category[]>('get_categories');
    }
}

export default TagsExplorerStore;