import { open } from '@tauri-apps/api/shell';
import { Item } from 'bindings/';
import { autorun, makeAutoObservable } from 'mobx';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import HotkeysStore from './HotkeysStore';
import NavigationStore from './NavigationStore';

class ExplorerStore {
    currentFolder: Item[];
    navigate?: (dir: number) => void;

    constructor(
		private readonly hotkeysStore: HotkeysStore,
		private readonly navigationStore: NavigationStore,
    ) {
        this.currentFolder = [];
        this.subscribe();
        makeAutoObservable(this);
        autorun(async () => {
            if (!this.navigationStore.path) return;
            this.currentFolder = [];
            this.currentFolder = (await ipcInvoke<Item[]>('read_dir', { path: this.navigationStore.path })).sort((a, b)=> Number(b.isDir) - Number(a.isDir));
            this.navigationStore.setItems = this.currentFolder;
            this.navigationStore.setCurrentFolder = this.currentFolder;
        });
    }

    openSelected() {
        if (this.navigationStore.selectedItem?.isFile)
            open(this.navigationStore.selectedItem.path);
        else if (this.navigationStore.selectedItem?.isDir)
            this.navigationStore.historyPush(this.navigationStore.selectedItem.path);
    }

    private subscribe() {
        this.hotkeysStore.setAction(['Enter', 'NumpadEnter'], () => this.openSelected());
    }
}

export default ExplorerStore;