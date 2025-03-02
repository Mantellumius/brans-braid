import { makeAutoObservable } from 'mobx';
import ExplorerStore from './ExplorerStore';
import { createContext, ReactNode, useContext } from 'react';
import ContextMenuStore from './ContextMenuStore';
import HotkeysStore from './HotkeysStore';
import SearchStore from './SearchStore';
import TagsExplorerStore from './TagsExplorerStore';
import NavigationStore from './NavigationStore';
import PopupStore from './PopupStore';

class RootStore {
    explorerStore: ExplorerStore;
    contextMenuStore: ContextMenuStore;
    hotkeysStore: HotkeysStore;
    searchStore: SearchStore;
    tagsExplorerStore: TagsExplorerStore;
    navigationStore: NavigationStore;
    popupStore: PopupStore;

    constructor() {
        this.popupStore = new PopupStore();
        this.hotkeysStore = new HotkeysStore();
        this.navigationStore = new NavigationStore(this.hotkeysStore);
        this.tagsExplorerStore = new TagsExplorerStore(this.navigationStore, this.hotkeysStore);
        this.searchStore = new SearchStore(this.hotkeysStore, this.navigationStore);
        this.explorerStore = new ExplorerStore(this.hotkeysStore, this.navigationStore);
        this.contextMenuStore = new ContextMenuStore(this.navigationStore, this.popupStore);
        makeAutoObservable(this);
    }
}

export default RootStore;

const StoreContext = createContext(null as unknown as RootStore);
export const StoreProvider = ({ children, store }:
	{ children: ReactNode | ReactNode[] | undefined, store: RootStore; }) => {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};
export const useRootStore = () => useContext(StoreContext);