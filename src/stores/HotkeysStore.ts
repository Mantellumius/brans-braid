import { makeAutoObservable } from 'mobx';

class HotkeysStore {
	actions: Map<string, () => void>;

	constructor() {
		this.actions = new Map();
		this.subscribe();
		makeAutoObservable(this);
	}

	private subscribe() {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	private handleKeyDown(e: KeyboardEvent) {
		this.getAction(e)?.();
	}

	setAction(key: string, action: () => void) {
		this.actions.set(key, action);
	}

	getAction(e: KeyboardEvent) {
		const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${e.key}`;
		console.log(key);
		if (!this.actions.has)
			return () => { };
		return this.actions.get(key);
	}
}

export default HotkeysStore;