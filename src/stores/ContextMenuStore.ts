import { isRegistered, register } from '@tauri-apps/plugin-global-shortcut';
import { Folder, Item } from 'bindings/';
import { makeAutoObservable } from 'mobx';
import { ipcInvoke } from 'shared/lib/ipcInvoke/ipcInvoke';
import { showMenu } from 'tauri-plugin-context-menu';
import NavigationStore from './NavigationStore';
import PopupStore from './PopupStore';

class ContextMenuStore {
    constructor(
		private readonly navigationStore: NavigationStore,
		private readonly popupStore: PopupStore
    ) {
        makeAutoObservable(this);
        this.subscribe();
        this.register();
    }

    subscribe() {
        window.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            const folderRootElement = this.findItemRoot(e.target as HTMLElement);
            if (folderRootElement)
                return this.folderContextMenu(e, folderRootElement);
        });
    }

    async register() {
        if (!await isRegistered('Control+Alt+O'))
            await register('Control+Alt+O', async () => {
                await this.openInVsCode();
            });
    }

    private folderContextMenu(e: MouseEvent, target: HTMLElement) {
        const item = this.navigationStore.items[Number(target.dataset['index'])];
        return showMenu({
            pos: { x: e.clientX, y: e.clientY },
            items: [
                {
                    label: 'Open in VSCode',
                    event: () => {
                        this.openInVsCode(item);
                    },
                    shortcut: 'ctrl+B'
                },
                {
                    label: 'Add tag',
                    event: () => {
                        this.addTag(item);
                    }
                },
                {
                    label: 'Analyze',
                    event: () => {
                        this.analyzeFolder(item);
                    }
                }
            ]
        });
    }

    private *analyzeFolder(item: Item) {
        if (item.isFile) return;
        const response: string[] = yield ipcInvoke('analyze_languages', { path: item.path });
        console.log(response);
    }

    private findItemRoot(target: HTMLElement): null | HTMLElement {
        while (target && typeof target.dataset['index'] === 'undefined') {
            target = target.parentElement as HTMLElement;
        }
        return target;
    }

    private openInVsCode(item?: Item) {
        if (item)
            return ipcInvoke('code', { path: item.path });
        return ipcInvoke('code', { path: this.navigationStore.selectedItem?.path });
    }

    private async addTag(item: Item) {
        const folder = await ipcInvoke<Folder>('get_or_create_folder', { path: item.path });
        const tag = await this.popupStore.askTagName();
        if (!tag || !folder) return;
        ipcInvoke('add_tag', { folderId: folder.id, tagId: tag.id });
    }
}

export default ContextMenuStore;