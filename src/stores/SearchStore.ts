import { makeAutoObservable } from 'mobx';
import { RefObject } from 'react';
import { ExplorerItem } from 'widgets/Files';
import ExplorerStore from './ExplorerStore';
import HotkeysStore from './HotkeysStore';
import { invoke } from '@tauri-apps/api/tauri';

class SearchStore {
	private depth: 'one' | 'max' = 'one';
	inputRef?: RefObject<HTMLInputElement>;
	result: ExplorerItem[];
	number: number = -1;
	query = '';

	constructor(
		private readonly hotkeysStore: HotkeysStore,
		private readonly explorerStore: () => ExplorerStore,
	) {
		this.explorerStore = explorerStore;
		this.hotkeysStore = hotkeysStore;
		this.result = [];
		this.subscribe();
		makeAutoObservable(this);
	}

	get depthToNumber() {
		return this.depth === 'one' ? 1 : Number.MAX_SAFE_INTEGER;
	}

	get isSearching() {
		return this.number >= 0;
	}

	set setQuery(query: string) {
		this.query = query;
	}

	subscribe() {
		this.hotkeysStore.setAction('ctrl+f', (e) => {
			e.preventDefault();
			this.depth = 'one';
			this.inputRef?.current?.focus();
		});
		this.hotkeysStore.setAction('ctrl+shift+f', (e) => {
			e.preventDefault();
			this.depth = 'max';
			this.inputRef?.current?.focus();
		});
	}

	*search() {
		if (!this.query) {
			this.number = -1;
			this.result = [];
			return;
		}
		this.number = yield invoke('create_searcher', {
			path: this.explorerStore().path,
			query: this.query,
			depth: this.depthToNumber,
		});
		this.processQuery(this.number, this.query);
	}

	*processQuery(searcherNumber: number, query: string) {
		this.result = [];
		let items: ExplorerItem[] | null = null;
		while (items?.length !== 0) {
			items = yield invoke<ExplorerItem[]>('get_search_results', { searcherNumber, query });
			if (searcherNumber !== this.number) return;
			this.result.push(...items!);
		}
		this.number = -1;
	}
}

export default SearchStore;