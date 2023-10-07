import { Link, Outlet } from 'react-router-dom';
import './styles/index.scss';

function App() {
	return (
		<div className="app dark">
			<Outlet />
			<Link to={'explorer/?path=M:\\'}>
				Explorer
			</Link>
		</div>
	);
}

export default App;
