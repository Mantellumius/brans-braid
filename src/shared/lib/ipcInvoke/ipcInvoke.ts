import { invoke } from '@tauri-apps/api';
import { IpcResponse } from 'bindings/';

/** 
 * Small wrapper on top of tauri api invoke
 * 
 * best-practice: Light and narrow external api abstraction. 
 */
export async function ipcInvoke<T>(method: string, params?: { [key in string]: unknown }): Promise<T> {
    const response = await invoke<IpcResponse<T>>(method, params);
    if (response.error != null) {
        throw new Error(response.error.message);
    } else {
        return response.result!.data;
    }
}
