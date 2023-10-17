import { makeAutoObservable } from 'mobx';
import { RefObject } from 'react';
import { Item } from 'bindings/';
import HotkeysStore from './HotkeysStore';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import { IpcSimpleResult } from 'bindings/IpcSimpleResult';
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
		this.hotkeysStore.setAction('ctrl+f', () => {
			this.depth = 'one';
			this.inputRef?.current?.focus();
		});
		this.hotkeysStore.setAction('ctrl+shift+f', () => {
			this.depth = 'max';
			this.inputRef?.current?.focus();
		});
	}

	*search(path: string) {
		if (!this.query) {
			this.queryNumber = -1;
			this.items = null;
		} else {
			const response: IpcSimpleResult<number> = yield ipcInvoke<number>('create_searcher', {
				path,
				query: this.query,
				depth: this.depthToNumber,
			});
			this.queryNumber = response.data;
			this.processQuery(this.queryNumber, this.query);
		}
		this.navigationStore.setItems = this.items;
	}

	*processQuery(searcherNumber: number, query: string) {
		this.items = [];
		let items: Item[] | null = null;
		while (items?.length !== 0) {
			const response: IpcSimpleResult<Item[]> = yield ipcInvoke<Item[]>('get_search_results', { searcherNumber, query });
			items = response.data;
			if (searcherNumber !== this.queryNumber) return;
			this.items.push(...items!);
		}
		this.queryNumber = -1;
	}
}

export default SearchStore;