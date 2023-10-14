import { makeAutoObservable } from 'mobx';
import ExplorerStore from './ExplorerStore';
import { createContext, ReactNode, useContext } from 'react';
import ContextMenuStore from './ContextMenuStore';
import HotkeysStore from './HotkeysStore';
import SearchStore from './SearchStore';
import TagsExplorerStore from './TagsExplorerStore';

class RootStore {
	explorerStore: ExplorerStore;
	contextMenuStore: ContextMenuStore;
	hotkeysStore: HotkeysStore;
	searchStore: SearchStore;
	tagsExplorerStore: TagsExplorerStore;
	
	constructor() {
		this.hotkeysStore = new HotkeysStore();
		this.tagsExplorerStore = new TagsExplorerStore();
		this.searchStore = new SearchStore(this.hotkeysStore);
		this.explorerStore = new ExplorerStore(this.hotkeysStore, this.searchStore, this.tagsExplorerStore);
		this.contextMenuStore = new ContextMenuStore(this.explorerStore);
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