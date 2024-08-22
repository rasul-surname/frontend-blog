import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../../redux/slices/auth'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'

export const AddPost = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const isAuth = useSelector(selectIsAuth)
	const [isLoading, setIsLoading] = useState(false)
	const [text, setText] = useState('')
	const [title, setTitle] = useState('')
	const [tags, setTags] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const inputFileRef = useRef(null)
	const isEditing = Boolean(id)

	const handleChangeFile = async (e) => {
		try {
			const formData = new FormData()
			const file = e.target.files[0]
			formData.append('image', file)

			const { data } = await axios.post('/upload', formData)
			console.log({ data })
			setImageUrl(data.url)
		} catch (e) {
			console.log('err', e)
		}
	}

	const onClickRemoveImage = () => {
		setImageUrl('')
	}

	const onChange = useCallback((value) => {
		setText(value)
	}, [])

	const options = useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	)

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/" />
	}

	const onSubmit = async () => {
		try {
			setIsLoading(true)

			const fields = {
				title,
				tags: tags.split(','),
				imageUrl,
				text,
			}

			const { data } = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts', fields)

			const _id = isEditing ? id : data._id

			navigate(`/posts/${_id}`)
		} catch (e) {
			alert('Ошибка при создании статьи')
		}
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (id) {
			axios.get(`/posts/${id}`).then(({ data }) => {
				setTitle(data.title)
				setText(data.text)
				setTags(data.tags.join(','))
				setImageUrl(data.imageUrl)
			})
		}
	}, [id])

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				variant="outlined"
				size="large"
				onClick={() => inputFileRef.current.click()}
			>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type="file"
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Заголовок статьи..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Тэги"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button
					size="large"
					variant="contained"
					onClick={onSubmit}
				>
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href="/">
					<Button size="large">Отмена</Button>
				</a>
			</div>
		</Paper>
	)
}
