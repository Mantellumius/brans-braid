import React from 'react';
import ReactDOM from 'react-dom/client';
import RootStore, { StoreProvider } from 'stores/RootStore';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Explorer } from 'pages/Explorer';
import Layout from './app/Layout';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children:[
			{
				path: '',
				element: <Explorer />
			}
		]
	}
]);

const rootStore = new RootStore(router.navigate);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<StoreProvider store={rootStore}>
		<React.StrictMode>
			<RouterProvider router={router}/>
		</React.StrictMode>
	</StoreProvider>
);
