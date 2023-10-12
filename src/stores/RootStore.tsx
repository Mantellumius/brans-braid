import { makeAutoObservable } from 'mobx';
import ExplorerStore from './ExplorerStore';
import { createContext, ReactNode, useContext } from 'react';
import ContextMenuStore from './ContextMenuStore';
import NavigationStore from './NavigationStore';
import HotkeysStore from './HotkeysStore';
import SearchStore from './SearchStore';

class RootStore {
	explorerStore: ExplorerStore;
	contextMenuStore: ContextMenuStore;
	navigationStore: NavigationStore;
	hotkeysStore: HotkeysStore;
	searchStore: SearchStore;

	constructor() {
		this.hotkeysStore = new HotkeysStore();
		this.navigationStore = new NavigationStore(this.hotkeysStore, () => this.explorerStore);
		this.contextMenuStore = new ContextMenuStore(() => this.explorerStore);
		this.searchStore = new SearchStore(this.hotkeysStore, () => this.explorerStore);
		this.explorerStore = new ExplorerStore(() => this.hotkeysStore, 
			() => this.searchStore, 
			() => this.navigationStore);
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