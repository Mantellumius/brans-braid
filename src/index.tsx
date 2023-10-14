import React from 'react';
import ReactDOM from 'react-dom/client';
import RootStore, { StoreProvider } from 'stores/RootStore';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Explorer } from 'pages/Explorer';
import Layout from './app/Layout';
import { TagsExplorer } from 'pages/TagsExplorer';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children:[
			{
				path: '/explorer',
				element: <Explorer />
			},
			{
				path: '/tags',
				element: <TagsExplorer />
			},
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
