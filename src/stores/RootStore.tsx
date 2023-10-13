import { makeAutoObservable } from 'mobx';
import ExplorerStore from './ExplorerStore';
import { createContext, ReactNode, useContext } from 'react';
import ContextMenuStore from './ContextMenuStore';
import HotkeysStore from './HotkeysStore';
import SearchStore from './SearchStore';

class RootStore {
	explorerStore: ExplorerStore;
	contextMenuStore: ContextMenuStore;
	hotkeysStore: HotkeysStore;
	searchStore: SearchStore;

	constructor() {
		this.hotkeysStore = new HotkeysStore();
		this.searchStore = new SearchStore(this.hotkeysStore);
		this.explorerStore = new ExplorerStore(this.hotkeysStore, this.searchStore);
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