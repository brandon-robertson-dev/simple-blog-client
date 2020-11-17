import React, {useState} from 'react'
import {withRouter} from 'react-router-dom'
import {useGlobalState} from '../config/store'
import {addBlogPost} from '../services/blogPostServices'
import {TextArea, Block, Input, Label, InputButton, ErrorText} from './StyledComponents'

const NewBlogPost = ({history}) => {

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
        const newPost = {
            title: formState.title,
            category: formState.category || "general",
            content: formState.content
        }
        addBlogPost(newPost).then((newPost) => {
            dispatch({
                type: "setBlogPosts",
                data: [newPost ,...blogPosts]
            })
            history.push(`/posts/${newPost._id}`)
        }).catch((error) => {
            const status = error.response ? error.response.status : 500
            console.log("caught error on edit", error)
            if(status === 403)
                setErrorMessage("Oops! It appears we lost your login session. Make sure 3rd party cookies are not blocked by your browser settings.")
            else
                setErrorMessage("Well, this is embarrassing... There was a problem on the server.")
        })
    }
    const initialFormState = {
        title: "",
        category: "",
        content: ""
    } 
    const [formState,setFormState] = useState(initialFormState)
    const [errorMessage, setErrorMessage] = useState(null)
    const {store, dispatch} = useGlobalState()
    const {blogPosts} = store

    return (
        <form id="newPostForm" onSubmit={handleSubmit}>
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <Block>
                <Label>Title</Label>
                <Input required type="text" name="title" placeholder="Enter a title" onChange={handleChange}></Input>
            </Block>
            <Block>
                <Label>Category</Label>
                <Input type="text" name="category" placeholder="Enter a category" onChange={handleChange}></Input>
            </Block>
            <Block>
                <Label>Content</Label>
                <TextArea form="newPostForm" required name="content" placeholder="Enter post here" onChange={handleChange}></TextArea>
            </Block>
            <Block>
                <InputButton type="submit" value="Add post"></InputButton>
            </Block>
        </form>
    ) 
}

export default withRouter(NewBlogPost)