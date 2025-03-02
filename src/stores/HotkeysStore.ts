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
        this.setAction(
            ['ctrl+shift+KeyG', 'ctrl+KeyG', 'ctrl+KeyP', 'ctrl+KeyP'],
            (e) => e.preventDefault()
        );
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

    setAction(key: string | string[], action: (e: KeyboardEvent) => void) {
        if (Array.isArray(key))
            key.forEach((k) => this.actions.set(k, action));
        else
            this.actions.set(key, action);
    }
}

export default HotkeysStore;