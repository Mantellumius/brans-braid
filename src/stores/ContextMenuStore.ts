import { showMenu } from 'tauri-plugin-context-menu';
import { makeAutoObservable } from 'mobx';
import { invoke } from '@tauri-apps/api';
import { register, isRegistered } from '@tauri-apps/api/globalShortcut';
import ExplorerStore from './ExplorerStore';

class ContextMenuStore {
	constructor(private readonly explorerStore: () => ExplorerStore) {
		this.explorerStore = explorerStore;
		makeAutoObservable(this);
		this.subscribe();
		this.register();
	}

	subscribe() {
		window.addEventListener('contextmenu', this.onContextMenuOpen.bind(this));
	}

	async register() {
		if (!await isRegistered('Control+Alt+O'))
			await register('Control+Alt+O', async () => {
				await this.openInVsCode();
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
							await this.openInVsCode();
						},
						payload: e,
						shortcut: 'ctrl+B'
					}
				]
			}
		);
	}

	openInVsCode() {
		return invoke('code', { path: this.explorerStore().selectedItem?.path });
	}
}

export default ContextMenuStore;