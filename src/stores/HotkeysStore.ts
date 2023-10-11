import { makeAutoObservable } from 'mobx';

class HotkeysStore {
	private actions: Map<string, (e: KeyboardEvent) => void>;

	constructor() {
		this.actions = new Map();
		this.subscribe();
		makeAutoObservable(this);
	}

	private subscribe() {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	private handleKeyDown(e: KeyboardEvent) {
		this.getAction(e)?.(e);
	}

	setAction(key: string, action: (e: KeyboardEvent) => void) {
		this.actions.set(key, action);
	}

	getAction(e: KeyboardEvent) {
		const key = [(e.ctrlKey && 'ctrl'), (e.altKey && 'alt'), (e.shiftKey && 'shift'), e.key]
			.filter(Boolean)
			.join('+');
		if (!this.actions.has)
			return () => { };
		return this.actions.get(key);
	}
}

export default HotkeysStore;