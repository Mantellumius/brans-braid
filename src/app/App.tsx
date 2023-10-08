import { Link, Outlet } from 'react-router-dom';
import './styles/index.scss';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { Button } from 'shared/ui/Button/Button';
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		const arr = [];
		listen<number>('test', (event) => {
			if (event.payload=== 999)
				console.log('Finished', arr.length);
		});
	}, []);
	return (
		<div className="app dark">
			<Outlet />
			<Link to={'explorer/?path=M:\\'}>
				Explorer
			</Link>
			<Button onClick={() => invoke('test')}>
				Test
			</Button>
		</div>
	);
}

export default App;
