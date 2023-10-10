import { makeAutoObservable } from 'mobx';
import ExplorerStore from './FileExplorerStore';
import { createContext, ReactNode, useContext } from 'react';
import ContextMenuStore from './ContextMenuStore';

class RootStore {
	fileExplorerStore: ExplorerStore;
	contextMenuStore: ContextMenuStore;

	constructor() {
		this.fileExplorerStore = new ExplorerStore();
		this.contextMenuStore = new ContextMenuStore();
		makeAutoObservable(this);
	}
}

export default RootStore;

const StoreContext = createContext(null as unknown as RootStore);
export const StoreProvider = ({ children, store }:
	{ children: ReactNode | ReactNode[] | undefined, store: RootStore; }) => {
	return (
		<StoreContext.Provider value= {store} >
			{children}
		</StoreContext.Provider>
	);
};
export const useRootStore = () => useContext(StoreContext);