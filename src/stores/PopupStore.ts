import { Tag } from 'bindings/';
import { makeAutoObservable } from 'mobx';

class PopupStore {
    show: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private resolve: ((value: any | null) => void) | null;

    constructor() {
        this.show = false;
        this.resolve = null;
        makeAutoObservable(this);
    }

    askTagName(): Promise<Tag | null> {
        this.show = true;
        return new Promise((resolve) => {
            this.resolve = resolve;
        });
    }

    resolvePopup(value: Tag | null) {
        this.resolve?.(value);
        this.resolve = null;
        this.show = false;
    }
}

export default PopupStore;