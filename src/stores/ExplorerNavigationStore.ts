import { makeAutoObservable } from 'mobx';
import HotkeysStore from './HotkeysStore';

class ExplorerNavigationStore {
	actionMultiplier = '';
	navigate?: (dir: number) => void;


	constructor(private readonly hotkeysStore: HotkeysStore) {
		this.hotkeysStore = hotkeysStore;
		this.buildActions();
		makeAutoObservable(this);
	}

	private buildActions() {
		this.hotkeysStore.setAction('h', () => this.navigate?.(this.consumeMultiplier() * -1));
		this.hotkeysStore.setAction('j', () => this.multiplyFolderMove('down'));
		this.hotkeysStore.setAction('k', () => this.multiplyFolderMove('up'));
		this.hotkeysStore.setAction('l', () => this.navigate?.(this.consumeMultiplier()));
		for (let i = 0; i < 10; i++) {
			this.hotkeysStore.actions.set(i.toString(), () => this.actionMultiplier += i.toString());
		}
	}

	private consumeMultiplier() {
		const multiplier = Number(this.actionMultiplier || '1');
		this.actionMultiplier = '';
		return multiplier;
	}

	private multiplyFolderMove(move: 'down' | 'up') {
		let toFocus = document.activeElement as HTMLButtonElement;
		const action = move === 'up' ? (elem: Element) => elem.previousSibling : (elem: Element) => elem.nextSibling;
		const multiplier = this.consumeMultiplier();
		for (let i = 0; i < multiplier && action(toFocus) !== null; i++) {
			toFocus = action(toFocus) as HTMLButtonElement;
		}
		toFocus.focus?.();
	}
}
export default ExplorerNavigationStore;