import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Header } from './components'
import { Route, Routes } from 'react-router-dom'
import Container from '@mui/material/Container'
import { fetchAuthMe } from './redux/slices/auth'
import { AddPost, FullPost, Home, Login, Registration } from './pages'

function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchAuthMe())
	}, [])

	return (
		<>
			<Header />
			<Container maxWidth="lg">
				<Routes>
					<Route
						path=""
						element={<Home />}
					/>
					<Route
						path="/posts/:id"
						element={<FullPost />}
					/>
					<Route
						path="/posts/:id/edit"
						element={<AddPost />}
					/>
					<Route
						path="/add-post"
						element={<AddPost />}
					/>
					<Route
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/register"
						element={<Registration />}
					/>
				</Routes>
			</Container>
		</>
	)
}

export default App
