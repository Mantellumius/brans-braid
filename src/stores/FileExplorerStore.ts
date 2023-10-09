import { makeAutoObservable, runInAction } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import { listen, emit } from '@tauri-apps/api/event';
import { ExplorerItem } from 'widgets/Files';

class ExplorerStore {
	path = '';
	query = '';
	currentFolder: ExplorerItem[];
	searchResults: ExplorerItem[];
	unlisten?: () => void;

	constructor() {
		this.currentFolder = [];
		this.searchResults = [];
		this.read('C:\\');
		makeAutoObservable(this);
	}

	get items() {
		if (this.query) return this.searchResults;
		return this.currentFolder;
	}

	get isSearching() {
		return !!this.unlisten;
	}

	*read(path: string) {
		this.path = path;
		this.searchResults = [];
		this.query = '';
		this.currentFolder = yield invoke<ExplorerItem[]>('read_dir', { path });
	}

	search(query: string) {
		this.query = query;
		if (!query) return this.stopSearch();
		invoke<number>('search', { path: this.path, query: this.query }).then((callNumber) => {
			console.log(`Starting search ${callNumber}`);
			runInAction(async () => {
				this.unlisten?.();
				this.searchResults = [];
				this.unlisten = await listen<ExplorerItem[]>(`on_search_result-${callNumber}`, (event) => {
					runInAction(() => {
						if (event.payload.length === 0) {
							this.stopSearch();
							return;
						}
						this.searchResults.push(...event.payload);
					});
				});
				emit(`start_processing_search_call-${callNumber}`);
			});
		});
	}

	private stopSearch() {
		this.unlisten?.();
		this.unlisten = undefined;
		invoke('stop_search');
	}
}

export default ExplorerStore;