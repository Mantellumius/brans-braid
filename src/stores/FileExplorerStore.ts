import { makeAutoObservable, runInAction } from 'mobx';
import { invoke } from '@tauri-apps/api/tauri';
import { listen, emit } from '@tauri-apps/api/event';
import { ExplorerItem } from 'widgets/FileExplorer';

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


	*read(path: string) {
		this.path = path;
		this.searchResults = [];
		this.query = '';
		this.currentFolder = yield invoke<ExplorerItem[]>('read_dir', { path });
	}

	search(query: string) {
		this.query = query;
		if (!query) return;
		invoke<number>('search', { path: this.path, query: this.query }).then((callNumber) => {
			runInAction(async () => {
				this.unlisten?.();
				this.searchResults = [];
				this.unlisten = await listen<ExplorerItem[]>(`on_search_result-${callNumber}`, (event) => {
					runInAction(() => {
						if (this.searchResults.length % 100 === 0) {
							console.log(this.searchResults.length);
						}
						if (event.payload.length === 0) {
							this.unlisten?.();
							this.unlisten = undefined;
							console.log(`Finished ${callNumber} Query: ${query}`);
							return;
						}
						this.searchResults.push(...event.payload);
					});
				});
				emit(`start_processing_search_call-${callNumber}`);
				console.log(`Start ${callNumber}`);
			});
		});
	}
}

export default ExplorerStore;