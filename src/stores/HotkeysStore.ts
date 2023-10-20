import { makeAutoObservable } from 'mobx';

class HotkeysStore {
	private actions: Map<string, (e: KeyboardEvent) => void>;

	constructor() {
		this.actions = new Map();
		this.subscribe();
		this.addReset();
		makeAutoObservable(this);
	}

	private addReset() {
		this.setAction('ctrl+shift+KeyG', (e) => e.preventDefault());
		this.setAction('ctrl+KeyG', (e) => e.preventDefault());
		this.setAction('ctrl+KeyP', (e) => e.preventDefault());
		this.setAction('ctrl+shift+KeyS', (e) => e.preventDefault());
	}

	private subscribe() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this));
		window.addEventListener('click', (e) => (e.altKey && e.button === 0) && e.preventDefault());
		window.addEventListener('mousedown', (e) => (e.button === 3 || e.button === 4) && e.preventDefault());
	}

	private handleKeyDown(e: KeyboardEvent) {
		const target = e.target as Element;
		if (target.tagName === 'INPUT' && target.getAttribute('type') !== 'checkbox') return;
		const key = [(e.ctrlKey && 'ctrl'), (e.altKey && 'alt'), (e.shiftKey && 'shift'), e.code]
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