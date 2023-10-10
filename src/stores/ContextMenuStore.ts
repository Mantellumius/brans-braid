import { showMenu } from 'tauri-plugin-context-menu';
import { makeAutoObservable } from 'mobx';
import { invoke } from '@tauri-apps/api';
import { register } from '@tauri-apps/api/globalShortcut';

class ContextMenuStore {
	path = '';
	constructor() {
		makeAutoObservable(this);
		this.subscribe();
		this.register();
	}

	subscribe() {
		window.addEventListener('contextmenu', this.onContextMenuOpen.bind(this));
	}

	async register() {
		await register('Control+B', () => {
			this.openInVsCode();
		});
	}

	private onContextMenuOpen(e: MouseEvent) {
		return showMenu(
			{
				pos: { x: e.clientX, y: e.clientY },
				items: [
					{
						label: 'Open in VSCode',
						event: async () => {
							this.openInVsCode();
						},
						payload: e,
						shortcut: 'ctrl+B'
					}
				]
			}
		);
	}

	setPath(path: string) {
		this.path = path;
	}

	openInVsCode() {
		console.log(this.path);
		invoke('code', { path: this.path });
	}
}

export default ContextMenuStore;