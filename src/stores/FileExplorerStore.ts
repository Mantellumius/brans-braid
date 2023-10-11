import { makeAutoObservable } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import { ExplorerItem } from 'widgets/Files';
import { RefObject } from 'react';
import HotkeysStore from './HotkeysStore';

class ExplorerStore {
	private searchDepth: 'one' | 'max' = 'one';
	path = '';
	query = '';
	currentFolder: ExplorerItem[];
	searchResults: ExplorerItem[];
	searcherNumber: number = -1;
	searchInputRef?: RefObject<HTMLInputElement>;

	constructor(private readonly hotkeysStore: HotkeysStore) {
		this.hotkeysStore = hotkeysStore;
		this.currentFolder = [];
		this.searchResults = [];
		this.read('C:\\');
		this.subscribe();
		makeAutoObservable(this);
	}

	subscribe() {
		this.hotkeysStore.setAction('ctrl+f', (e) => {
			e.preventDefault();
			this.searchDepth = 'one';
			this.searchInputRef?.current?.focus();
		});
		this.hotkeysStore.setAction('ctrl+shift+f', (e) => {
			e.preventDefault();
			this.searchDepth = 'max';
			this.searchInputRef?.current?.focus();
		});
	}

	get items() {
		if (this.query) return this.searchResults;
		return this.currentFolder;
	}

	get isSearching() {
		return this.searcherNumber >= 0;
	}

	get depthToNumber() {
		return this.searchDepth === 'one' ? 1 : Number.MAX_SAFE_INTEGER;
	}

	*read(path: string) {
		this.path = path;
		this.searchResults = [];
		this.query = '';
		this.currentFolder = yield invoke<ExplorerItem[]>('read_dir', { path });
	}

	*search() {
		if (!this.query) {
			this.searcherNumber = -1;
			this.searchResults = [];
			return;
		}
		this.searcherNumber = yield invoke('create_searcher', {
			path: this.path,
			query: this.query,
			depth: this.depthToNumber,
		});
		this.processQuery(this.searcherNumber, this.query);
	}

	*processQuery(searcherNumber: number, query: string) {
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