import { makeAutoObservable, autorun } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import { ExplorerItem } from 'widgets/Files';
import SearchStore from './SearchStore';
import HotkeysStore from './HotkeysStore';
import clamp from 'shared/lib/clamp/clamp';
import { open } from '@tauri-apps/api/shell';

interface History {
	redo: string[],
	undo: string[];
}

class ExplorerStore {
	currentFolder: ExplorerItem[];
	actionMultiplier = '';
	navigate?: (dir: number) => void;
	selectedIndex: number = 0;
	history: History;

	constructor(
		private readonly hotkeysStore: HotkeysStore,
		private readonly searchStore: SearchStore,
	) {
		this.currentFolder = [];
		this.hotkeysStore = hotkeysStore;
		this.history = { redo: [], undo: ['M:\\'] };
		this.subscribe();
		makeAutoObservable(this);
		autorun(async () => {
			if (!this.path) return;
			this.searchStore.result = [];
			this.searchStore.query = '';
			this.currentFolder = [];
			this.currentFolder = await invoke<ExplorerItem[]>('read_dir', { path: this.path });
		});
	}

	get items() {
		return this.searchStore.query ?
			this.searchStore.result :
			this.currentFolder;
	}

	get path() {
		return this.history.undo.at(-1)!;
	}

	get selectedItem() {
		return this.items[this.selectedIndex];
	}

	openSelected() {
		if (this.selectedItem?.is_file)
			open(this.selectedItem.path);
		else if (this.selectedItem?.is_dir)
			this.historyPush(this.selectedItem.path);
	}

	reload() {
		this.historyReplace(this.path);
	}

	historyPush(path: string) {
		if (!path) return;
		this.history.undo.push(path);
		this.history.redo = [];
		this.selectedIndex = 0;
	}

	historyReplace(path: string) {
		if (!path) return;
		this.history.undo[this.history.undo.length - 1] = path;
		this.selectedIndex = 0;
	}

	select(index: number) {
		this.selectedIndex = clamp(0, index, this.items.length - 1);
	}

	private subscribe() {
		this.hotkeysStore.setAction('enter', () => this.openSelected());
		this.hotkeysStore.setAction('ctrl+r', () => this.reload());
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

export default ExplorerStore;