import { makeAutoObservable } from 'mobx';
import ExplorerStore from './FileExplorerStore';
import { createContext, ReactNode, useContext } from 'react';
import ContextMenuStore from './ContextMenuStore';
import ExplorerNavigationStore from './ExplorerNavigationStore';
import HotkeysStore from './HotkeysStore';
import { NavigateFunction } from 'react-router-dom';

class RootStore {
	fileExplorerStore: ExplorerStore;
	contextMenuStore: ContextMenuStore;
	explorerNavigationStore: ExplorerNavigationStore;
	hotkeysStore: HotkeysStore;

	constructor(navigate: NavigateFunction) {
		this.hotkeysStore = new HotkeysStore();
		this.fileExplorerStore = new ExplorerStore(this.hotkeysStore);
		this.contextMenuStore = new ContextMenuStore();
		this.explorerNavigationStore = new ExplorerNavigationStore(this.hotkeysStore);
		this.explorerNavigationStore.navigate = navigate;
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