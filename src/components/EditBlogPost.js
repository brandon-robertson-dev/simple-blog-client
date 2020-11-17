import React, {useState, useEffect} from 'react'
import {withRouter} from 'react-router-dom'
import {useGlobalState} from '../config/store'
import {getPostFromId, updateBlogPost} from '../services/blogPostServices'
import {TextArea, Label, Input, InputButton, Block, ErrorText} from './StyledComponents'

const EditBlogPost = ({history, match}) => {

    const {store, dispatch} = useGlobalState()
    const {blogPosts} = store
    const postId = match && match.params ? match.params.id : -1
    const post = getPostFromId(blogPosts, postId)

    function handleChange(event) {
        const name = event.target.name
        const value = event.target.value
        setFormState({
            ...formState,
            [name]: value
        })
    }
    function handleSubmit(event) {
        event.preventDefault()
        const updatedPost = {
            _id: post._id,
            username: post.username,
            title: formState.title,
            category: formState.category || "general",
            modified_date: new Date(),
            content: formState.content
        }
        updateBlogPost(updatedPost).then(() => {
            const otherPosts = blogPosts.filter((post) => post._id !== updatedPost._id)
            dispatch({
                type: "setBlogPosts",
                data: [updatedPost, ...otherPosts]
            })
            history.push(`/posts/${post._id}`)
        }).catch((error) => {
            const status = error.response ? error.response.status : 500
            console.log("caught error on edit", error)
            if(status === 403)
                setErrorMessage("Oops! It appears we lost your login session. Make sure 3rd party cookies are not blocked by your browser settings.")
            else
                setErrorMessage("Well, this is embarrassing... There was a problem on the server.")
        })
    }

    // Set initial form values to what is in the current post
    const initialFormState = {
        title: "",
        category: "",
        content: ""
    } 

    const [formState,setFormState] = useState(initialFormState)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        // Set the formState to the fields in the post after mount and when post changes
        post && setFormState({
            title: post.title,
            category: post.category,
            content: post.content
        })
    },[post])

    return (
        <form id="editPostForm" onSubmit={handleSubmit}>
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <Block>
                <Label>Title</Label>
                <Input required type="text" name="title" value={formState.title} onChange={handleChange}></Input>
            </Block>
            <Block>
                <Label>Category</Label>
                <Input type="text" name="category" value={formState.category} onChange={handleChange}></Input>
            </Block>
            <Block>
                <Label>Content</Label>
                <TextArea form="editPostForm" required name="content" value={formState.content} onChange={handleChange}></TextArea>
            </Block>
            <Block>
                <InputButton type="submit" value="Update post"></InputButton>
            </Block>
        </form>
    ) 
}

export default withRouter(EditBlogPost)