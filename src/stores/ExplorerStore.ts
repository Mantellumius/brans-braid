import { makeAutoObservable, autorun } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import { ExplorerItem } from 'widgets/Files';
import HotkeysStore from './HotkeysStore';
import { open } from '@tauri-apps/api/shell';
import SearchStore from './SearchStore';
import NavigationStore from './NavigationStore';

class ExplorerStore {
	selectedItem?: ExplorerItem;
	currentFolder: ExplorerItem[];

	constructor(
		private readonly hotkeysStore: () => HotkeysStore,
		private readonly searchStore: () => SearchStore,
		private readonly explorerNavigationStore: () => NavigationStore,
	) {
		this.explorerNavigationStore = explorerNavigationStore;
		this.hotkeysStore = hotkeysStore;
		this.currentFolder = [];
		this.subscribe();
		autorun(async () => {
			if (!this.path) return;
			this.searchStore().result = [];
			this.searchStore().query = '';
			this.selectedItem = undefined;
			this.currentFolder = await invoke<ExplorerItem[]>('read_dir', { path: this.path });
		});
		makeAutoObservable(this);
	}

	subscribe() {
		this.hotkeysStore().setAction('enter', (e) => {
			e.preventDefault();
			this.open();
		});
		this.hotkeysStore().setAction('f5', (e) => {
			e.preventDefault();
			this.reload();
		});
		this.hotkeysStore().setAction('ctrl+r', (e) => {
			e.preventDefault();
			this.reload();
		});
	}

	reload() {
		this.explorerNavigationStore().replace(this.path);
	}

	open() {
		if (this.selectedItem?.is_file)
			open(this.selectedItem.path);
		else if (this.selectedItem?.is_dir)
			this.explorerNavigationStore().push(this.selectedItem.path);
	}

	get path() {
		return this.explorerNavigationStore().current!;
	}

	get items() {
		if (this.searchStore().query) return this.searchStore().result;
		return this.currentFolder;
	}
}

export default ExplorerStore;