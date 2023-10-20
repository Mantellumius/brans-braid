import { makeAutoObservable } from 'mobx';
import { RefObject } from 'react';
import { Item } from 'bindings/';
import HotkeysStore from './HotkeysStore';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import NavigationStore from './NavigationStore';

class SearchStore {
	private depth: 'one' | 'max' = 'one';
	inputRef?: RefObject<HTMLInputElement>;
	items: Item[] | null;
	queryNumber: number = -1;
	query = '';

	constructor(
		private readonly hotkeysStore: HotkeysStore,
		private readonly navigationStore: NavigationStore,
	) {
		this.hotkeysStore = hotkeysStore;
		this.items = null;
		this.subscribe();
		makeAutoObservable(this);
	}

	get depthToNumber() {
		return this.depth === 'one' ? 1 : Number.MAX_SAFE_INTEGER;
	}

	get isSearching() {
		return this.queryNumber >= 0;
	}

	set setQuery(query: string) {
		this.query = query;
	}

	subscribe() {
		this.hotkeysStore.setAction('ctrl+KeyF', (e) => {
			e.preventDefault();
			this.depth = 'one';
			this.inputRef?.current?.focus();
		});
		this.hotkeysStore.setAction('ctrl+shift+KeyF', (e) => {
			e.preventDefault();
			this.depth = 'max';
			this.inputRef?.current?.focus();
		});
	}

	*search(path: string) {
		if (!this.query) {
			this.queryNumber = -1;
			this.items = null;
		} else {
			this.queryNumber = yield ipcInvoke<number>('create_searcher', {
				path,
				query: this.query,
				depth: this.depthToNumber,
			});
			this.processQuery(this.queryNumber);
		}
		this.navigationStore.setItems = this.items;
	}

	*processQuery(searcherNumber: number) {
		this.items = [];
		let items: Item[] | null = null;
		while (items?.length !== 0) {
			items = yield ipcInvoke<Item[]>('get_search_results');
			if (searcherNumber !== this.queryNumber) return;
			this.items.push(...items!);
		}
		this.queryNumber = -1;
	}
}

export default SearchStore;