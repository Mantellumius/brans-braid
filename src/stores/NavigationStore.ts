import { Item } from 'bindings/';
import { makeAutoObservable } from 'mobx';
import clamp from 'shared/lib/clamp/clamp';
import HotkeysStore from './HotkeysStore';

class NavigationStore {
	private _items: Item[] | null;
	currentFolder: Item[];
	selectedIndex: number = 0;
	actionMultiplier = '';
	history: { redo: string[], undo: string[]; };

	constructor(
		private readonly hotkeysStore: HotkeysStore
	) {
		this._items = [];
		this.currentFolder = [];
		this.history = { redo: [], undo: ['M:\\'] };
		this.subscribe();
		makeAutoObservable(this);
	}

	set setItems(items: Item[] | null) {
		this._items = items;
		this.select(0);
	}

	get items() {
		if (this._items?.length)
			return this._items;
		return this.currentFolder;
	}


	get selectedItem() {
		return this.items[this.selectedIndex];
	}

	get path() {
		return this.history.undo.at(-1)!;
	}

	select(index: number) {
		this.selectedIndex = clamp(0, index, this.items.length - 1);
	}

	reload() {
		this.historyReplace(this.path);
	}

	historyPush(path: string) {
		if (!path) return;
		this.history.undo.push(path);
		this.history.redo = [];
	}

	historyReplace(path: string) {
		if (!path) return;
		this.history.undo[this.history.undo.length - 1] = path;
	}

	private subscribe() {
		// this.hotkeysStore.setAction('ctrl+r', () => this.reload());
		this.hotkeysStore.setAction('f5', () => this.reload());
		this.hotkeysStore.setAction('h', () => this.previousFolder(this.consumeMultiplier()));
		this.hotkeysStore.setAction('j', () => this.moveDown(this.consumeMultiplier()));
		this.hotkeysStore.setAction('k', () => this.moveUp(this.consumeMultiplier()));
		this.hotkeysStore.setAction('l', () => this.nextFolder(this.consumeMultiplier()));
		for (let i = 0; i < 10; i++)
			this.hotkeysStore.setAction(
				i.toString(),
				() => this.actionMultiplier += i
			);
	}

	private consumeMultiplier() {
		const multiplier = Number(this.actionMultiplier || '1');
		this.actionMultiplier = '';
		return multiplier;
	}

	private nextFolder(delta: number) {
		for (let i = 0; i < delta; i++) {
			const redo = this.history.redo.pop();
			if (redo === undefined) break;
			this.history.undo.push(redo);
		}
	}

	private previousFolder(delta: number) {
		for (let i = 0; i < delta && this.history.undo.length > 1; i++) {
			const undo = this.history.undo.pop();
			if (undo)
				this.history.redo.push(undo);
		}
	}

	private moveDown(delta: number) {
		this.select(this.selectedIndex + delta);
	}

	private moveUp(delta: number) {
		this.select(this.selectedIndex - delta);
	}
}

export default NavigationStore;