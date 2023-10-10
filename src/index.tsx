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
				path: 'explorer',
				element: <Explorer />
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<StoreProvider store={new RootStore()}>
		<React.StrictMode>
			<RouterProvider router={router}/>
		</React.StrictMode>
	</StoreProvider>
);
