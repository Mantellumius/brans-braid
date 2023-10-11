import { makeAutoObservable } from 'mobx';
import ExplorerStore from './FileExplorerStore';
import { createContext, ReactNode, useContext } from 'react';
import ContextMenuStore from './ContextMenuStore';
import ExplorerNavigationStore from './ExplorerNavigationStore';
import HotkeysStore from './HotkeysStore';

class RootStore {
	fileExplorerStore: ExplorerStore;
	contextMenuStore: ContextMenuStore;
	explorerNavigationStore: ExplorerNavigationStore;
	hotkeysStore: HotkeysStore;

	constructor() {
		this.fileExplorerStore = new ExplorerStore();
		this.contextMenuStore = new ContextMenuStore();
		this.hotkeysStore = new HotkeysStore();
		this.explorerNavigationStore = new ExplorerNavigationStore(this.hotkeysStore);
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