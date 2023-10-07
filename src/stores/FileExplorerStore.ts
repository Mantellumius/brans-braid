import { makeAutoObservable } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import { ExplorerItem } from 'widgets/FileExplorer';

class ExplorerStore {
	items: ExplorerItem[];

	constructor() {
		this.items = [];
		this.read('C:\\');
		makeAutoObservable(this);
	}

	*read(path: string) {
		this.items = yield invoke<ExplorerItem[]>('read_dir', { path });
	}
}


export default ExplorerStore;