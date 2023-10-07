import { makeAutoObservable } from 'mobx';
import ExplorerStore from './FileExplorerStore';
import { createContext, ReactNode, useContext } from 'react';

class RootStore {
	fileExplorerStore: ExplorerStore;

	constructor() {
		this.fileExplorerStore = new ExplorerStore();
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