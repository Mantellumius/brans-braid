import { makeAutoObservable } from 'mobx';
import HotkeysStore from './HotkeysStore';
import ExplorerStore from './ExplorerStore';
import clamp from 'shared/lib/clamp/clamp';

interface History {
	redo: string[],
	undo: string[];
}

class NavigationStore {
	actionMultiplier = '';
	navigate?: (dir: number) => void;
	selectedIndex: number = 0;
	history: History;

	constructor(
		private readonly hotkeysStore: HotkeysStore,
		private readonly explorerStore: () => ExplorerStore
	) {
		this.explorerStore = explorerStore;
		this.hotkeysStore = hotkeysStore;
		this.history = { redo: [], undo: ['M:\\'] };
		this.buildActions();
		makeAutoObservable(this);
	}

	get current() {
		return this.history.undo.at(-1);
	}

	push(path?: string) {
		if (!path) return;
		this.history.undo.push(path);
		this.history.redo = [];
		this.selectedIndex = 0;
	}

	replace(path?: string) {
		if (!path) return;
		this.history.undo[this.history.undo.length - 1] = path;
		this.selectedIndex = 0;
	}

	select(index: number) {
		this.selectedIndex = clamp(0, index, this.explorerStore().items.length - 1);
	}

	next(delta: number) {
		for (let i = 0; i < delta; i++) {
			const redo = this.history.redo.pop();
			if (redo)
				this.history.undo.push(redo);
		}
	}

	previous(delta: number) {
		console.log(this.history.undo);
		for (let i = 0; i < delta && this.history.undo.length > 1; i++) {
			const undo = this.history.undo.pop();
			if (undo)
				this.history.redo.push(undo);
		}
	}

	private buildActions() {
		this.hotkeysStore.setAction('h', () => this.previous(this.consumeMultiplier()));
		this.hotkeysStore.setAction('j', () => this.applyMultipliedVerticalMove('down'));
		this.hotkeysStore.setAction('k', () => this.applyMultipliedVerticalMove('up'));
		this.hotkeysStore.setAction('l', () => this.next(this.consumeMultiplier()));
		for (let i = 0; i < 10; i++) {
			this.hotkeysStore.setAction(i.toString(), () => this.actionMultiplier += i.toString());
		}
	}

	private consumeMultiplier() {
		const multiplier = Number(this.actionMultiplier || '1');
		this.actionMultiplier = '';
		return multiplier;
	}

	private applyMultipliedVerticalMove(move: 'down' | 'up') {
		const multiplier = this.consumeMultiplier();
		this.selectedIndex = clamp(0,
			this.selectedIndex + multiplier * (move === 'down' ? 1 : -1),
			this.explorerStore().items.length - 1);
	}
}
export default NavigationStore;