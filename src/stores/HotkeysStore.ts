import { makeAutoObservable } from 'mobx';

class HotkeysStore {
	private actions: Map<string, (e: KeyboardEvent) => void>;

	constructor() {
		this.actions = new Map();
		this.subscribe();
		makeAutoObservable(this);
	}

	private subscribe() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	private handleKeyDown(e: KeyboardEvent) {
		if ((e.target as Element).tagName === 'INPUT') return;
		const key = [(e.ctrlKey && 'ctrl'), (e.altKey && 'alt'), (e.shiftKey && 'shift'), e.key.toLowerCase()]
			.filter(Boolean)
			.join('+');
		const action = this.actions.get(key);
		if (action) {
			e.preventDefault();
			action(e);
		}
	}

	setAction(key: string, action: (e: KeyboardEvent) => void) {
		this.actions.set(key, action);
	}
}

export default HotkeysStore;