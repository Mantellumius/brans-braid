import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import RootStore, { StoreProvider } from 'stores/RootStore';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Explorer } from 'pages/Explorer';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'explorer',
				element: <Explorer />,
			}
		]
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<StoreProvider store={new RootStore()}>
		<React.StrictMode>
			<RouterProvider router={router}/>
		</React.StrictMode>,
	</StoreProvider>
);
