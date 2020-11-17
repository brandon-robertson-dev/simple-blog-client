import React, {useState} from 'react'
import TimeAgo from 'react-timeago'
import {useGlobalState} from '../config/store'
import {deleteBlogPost} from '../services/blogPostServices'
import {BlogLink, Button, PostTitle, ErrorText} from './StyledComponents'

const BlogPost = ({history, post, showControls}) => {

    const {store, dispatch} = useGlobalState()
    const {blogPosts, loggedInUser} = store
    const [errorMessage, setErrorMessage] = useState(null)
    // If we don't have a post, return null
    if (!post) return null

    const {title, username, modified_date, category, content} = post 
    const allowEditDelete = loggedInUser && loggedInUser === post.username
    // Handle the delete button
    function handleDelete(event) {
        event.preventDefault()
        deleteBlogPost(post._id).then(() => {
            console.log("deleted post")
            const updatedPosts = blogPosts.filter((blogPost) => blogPost._id !== post._id)
            dispatch({
                type: "setBlogPosts",
                data: updatedPosts
            })
            history.push("/")
        }).catch((error) => {
            const status = error.response ? error.response.status : 500
            console.log("caught error on edit", error)
            if(status === 403)
                setErrorMessage("Oops! It appears we lost your login session. Make sure 3rd party cookies are not blocked by your browser settings.")
            else
                setErrorMessage("Well, this is embarrassing... There was a problem on the server.")
        })
    }

    // Handle the edit button
    function handleEdit(event) {
        event.preventDefault()
        history.push(`/posts/edit/${post._id}`)
    }

    return (
        <div>
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <BlogLink to={`/posts/${post._id}`} >
                <PostTitle>{title}</PostTitle>
                <p>{username}</p>
                <TimeAgo date={modified_date}/>
                <p>{category}</p>
                <p>{content}</p>
                {showControls && allowEditDelete && (
                    <div>
                        <Button onClick={handleDelete}>Delete</Button>
                        <Button onClick={handleEdit}>Edit</Button>
                    </div>
                )}
            </BlogLink>
        </div>
    )
}

export default BlogPost