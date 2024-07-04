import React, { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from '../../axios'
import { selectIsAuth } from '../../redux/slices/auth'

import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'

export const AddPost = () => {
	const { id } = useParams()
	const [text, setText] = React.useState('')
	const [title, setTitle] = useState('')
	const [tags, setTags] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const isAuth = useSelector(selectIsAuth)
	const inputFileRef = useRef(null)

	const isEditing = !!id

	const navigate = useNavigate()

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData()
			const file = event.target.files[0]
			formData.append('image', file)
			const { data } = await axios.post('/upload', formData)
			setImageUrl(data.url)
		} catch (error) {
			console.warn(error)
			alert('Ошибка при загрузке файла...')
		}
	}

	const onClickRemoveImage = () => {
		if (window.confirm('Вы действительно хотите удалить аватар?')) {
			setImageUrl('')
		}
	}

	const onSubmit = async () => {
		try {
			setIsLoading(true)

			const fields = {
				title,
				imageUrl,
				tags,
				text,
			}

			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields)

			const _id = isEditing ? id : data._id

			navigate(`/posts/${_id}`)
		} catch (error) {
			console.warn(error)
			alert('Ошибка при создании статьи...')
		}
	}

	const onChange = React.useCallback((value) => {
		setText(value)
	}, [])

	useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title)
					setText(data.text)
					setImageUrl(data.imageUrl)
					setTags(data.tags.join(','))
				})
				.catch((error) => {
					console.warn(error)
					alert('Ошибка при получении статьи...')
				})
		}
	}, [])

	const options = React.useMemo(
		() => ({
			spellChecker: false, // Отключение проверки орфографии
			maxHeight: '400px', // Максимальная высота редактора
			autofocus: true, // Автофокус при загрузке страницы
			placeholder: 'Введите текст...', // Текст-заполнитель
			status: false, // Отключение статусной строки
			autosave: {
				// Настройки автосохранения
				enabled: true, // Включение автосохранения
				delay: 1000, // Задержка автосохранения (1 секунда)
			},
		}),
		[]
	)

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/" />
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant="outlined"
				size="large"
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
						src={`http://localhost:4444${imageUrl}`}
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
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<Link to="/">
					<Button size="large">Отмена</Button>
				</Link>
			</div>
		</Paper>
	)
}
