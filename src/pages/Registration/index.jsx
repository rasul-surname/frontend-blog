import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import styles from './Login.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'
import { Navigate } from 'react-router-dom'

export const Registration = () => {
	const dispatch = useDispatch()
	const isAuth = useSelector(selectIsAuth)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: 'Вася Пупкин',
			email: 'vasya@test.ru',
			password: '12345',
		},
		mode: 'onChange',
	})

	const onsubmit = async (values) => {
		const data = await dispatch(fetchRegister(values))

		if (!data.payload) {
			return alert('Не удалось зарегистрироваться')
		}

		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token)
		}
	}

	if (isAuth) {
		return <Navigate to="/" />
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography
				classes={{ root: styles.title }}
				variant="h5"
			>
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onsubmit)}>
				<TextField
					className={styles.field}
					label="Полное имя"
					fullWidth
					error={!!errors.fullName?.message}
					helperText={errors.fullName?.message}
					{...register('fullName', { required: 'Введите имя' })}
				/>
				<TextField
					className={styles.field}
					label="E-Mail"
					fullWidth
					error={!!errors.email?.message}
					helperText={errors.email?.message}
					{...register('email', { required: 'Введите почту' })}
				/>
				<TextField
					className={styles.field}
					label="Пароль"
					fullWidth
					error={!!errors.password?.message}
					helperText={errors.password?.message}
					{...register('password', { required: 'Введите пароль' })}
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	)
}
