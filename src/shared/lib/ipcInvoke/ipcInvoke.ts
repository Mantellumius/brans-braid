import { invoke } from '@tauri-apps/api';
import { IpcResponse } from 'bindings/';
import { IpcSimpleResult } from 'bindings/IpcSimpleResult';

/** 
 * Small wrapper on top of tauri api invoke
 * 
 * best-practice: Light and narrow external api abstraction. 
 */
export async function ipcInvoke<T>(method: string, params?: { [key in string]: unknown }): Promise<IpcSimpleResult<T>> {
	const response = await invoke<IpcResponse<T>>(method, params);
	if (response.error != null) {
		console.log('ERROR - ipc_invoke - ipc_invoke error', response);
		throw new Error(response.error.message);
	} else {
		return response.result!;
	}
}
