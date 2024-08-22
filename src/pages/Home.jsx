import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'
import { fetchPosts, fetchTags } from '../redux/slices/posts'

export const Home = () => {
	const dispatch = useDispatch()
	const userData = useSelector((state) => state.auth.data)
	const { posts, tags } = useSelector((state) => state.posts)
	const [value, setValue] = useState(0)

	const isPostsLoading = posts.status === 'loading'
	const isTagsLoading = tags.status === 'loading'

	useEffect(() => {
		dispatch(fetchPosts())
		dispatch(fetchTags())
	}, [])

	console.log({ posts, myId: userData })

	return (
		<>
			<Tabs
				value={value}
				onChange={(_, value) => setValue(value)}
				style={{ marginBottom: 15 }}
			>
				<Tab label="Новые" />
				<Tab label="Популярные" />
			</Tabs>
			<Grid
				container
				spacing={4}
			>
				<Grid
					xs={8}
					item
				>
					{isPostsLoading && <Post isLoading={true} />}
					{!!posts.items?.length &&
						posts.items.map(({ _id, user, ...restData }) => (
							<Post
								key={_id}
								id={_id}
								{...restData}
								isEditable={userData._id === user._id}
								commentsCount={3}
							/>
						))}
				</Grid>
				<Grid
					xs={4}
					item
				>
					<TagsBlock
						items={tags.items}
						isLoading={isTagsLoading}
					/>
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
								},
								text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	)
}
