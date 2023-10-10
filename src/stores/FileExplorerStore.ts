import { makeAutoObservable } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import { ExplorerItem } from 'widgets/Files';

class ExplorerStore {
	path = '';
	query = '';
	currentFolder: ExplorerItem[];
	searchResults: ExplorerItem[];
	searcherNumber: number = -1;

	constructor() {
		this.currentFolder = [];
		this.searchResults = [];
		this.read('C:\\');
		makeAutoObservable(this);
	}

	get items() {
		if (this.query) return this.searchResults;
		return this.currentFolder;
	}

	get isSearching() {
		return this.searcherNumber >= 0;
	}

	*read(path: string) {
		this.path = path;
		this.searchResults = [];
		this.query = '';
		this.currentFolder = yield invoke<ExplorerItem[]>('read_dir', { path });
	}

	*search(query: string) {
		this.query = query;
		if (!query) return this.searcherNumber = -1;
		const searcherNumber: number = yield invoke<number>('create_searcher', { path: this.path, query: this.query });
		this.searcherNumber = searcherNumber;
		this.getResultFrom(searcherNumber, query);
	}

	*getResultFrom(searcherNumber: number, query: string) {
		this.searchResults = [];
		let items: ExplorerItem[] | null = null;
		while (items?.length !== 0) {
			items = yield invoke<ExplorerItem[]>('get_search_results', { searcherNumber, query });
			if (searcherNumber !== this.searcherNumber) return;
			this.searchResults.push(...items!);
		}
		this.searcherNumber = -1;
	}
}

export default ExplorerStore;