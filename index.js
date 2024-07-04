import express from 'express'
import multer from 'multer'
import cors from 'cors'

import mongoose from 'mongoose'
import { checkAuth, handleValidationError } from './utils/index.js'
import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'
import { UserController, PostController } from './controllers/index.js'

mongoose
	.connect(
		'mongodb+srv://admin:admin123@cluster0.xuw9gtu.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
	)
	.then(() => console.log('DB ok'))
	.catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.post(
	'/auth/login',
	loginValidation,
	handleValidationError,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationError,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationError,
	PostController.create
)
app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationError,
	PostController.update
)
app.delete('/posts/:id', checkAuth, PostController.remove)

app.listen(4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log('Server OK')
})

// import express from 'express'
// import multer from 'multer'
// import cors from 'cors'
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// import { checkAuth, handleValidationError } from './utils/index.js'
// import {
// 	registerValidation,
// 	loginValidation,
// 	postCreateValidation,
// } from './validations.js'
// import { UserController, PostController } from './controllers/index.js'

// dotenv.config()

// const { PORT = 4444 } = process.env

// mongoose
// 	.connect(
// 		'mongodb+srv://admin:admin123@cluster0.xuw9gtu.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
// 	)
// 	.then(() => console.log('DB ok'))
// 	.catch((err) => console.log('DB error', err))

// const app = express()

// const storage = multer.diskStorage({
// 	destination: (_, __, cb) => {
// 		cb(null, 'uploads')
// 	},
// 	filename: (_, file, cb) => {
// 		cb(null, file.originalname)
// 	},
// })

// const upload = multer({ storage })

// app.use(cors())
// app.use(express.json())
// app.use('/uploads', express.static('uploads'))

// app.post(
// 	'/auth/login',
// 	loginValidation,
// 	handleValidationError,
// 	UserController.login
// )
// app.post(
// 	'/auth/register',
// 	registerValidation,
// 	handleValidationError,
// 	UserController.register
// )
// app.get('/auth/me', checkAuth, UserController.getMe)

// app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
// 	if (!req.file) {
// 		return res.status(400).json({ error: 'File upload failed' })
// 	}
// 	res.json({
// 		url: `/uploads/${req.file.originalname}`,
// 	})
// })

// app.get('/tags', PostController.getLastTags)

// app.get('/posts', PostController.getAll)
// app.get('/posts/tags', PostController.getLastTags)
// app.get('/posts/:id', PostController.getOne)
// app.post(
// 	'/posts',
// 	checkAuth,
// 	postCreateValidation,
// 	handleValidationError,
// 	PostController.create
// )
// app.patch(
// 	'/posts/:id',
// 	checkAuth,
// 	postCreateValidation,
// 	handleValidationError,
// 	PostController.update
// )
// app.delete('/posts/:id', checkAuth, PostController.remove)

// app.use((req, res) => {
// 	res.status(404).json({ message: 'Not Found' })
// })

// const startServer = async () => {
// 	try {
// 		app.listen(PORT, () => {
// 			console.log(`Server is running on port ${PORT}`)
// 		})
// 	} catch (error) {
// 		console.error('Server failed to start:', error)
// 	}
// }

// startServer()
