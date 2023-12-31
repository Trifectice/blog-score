import { Button,Container, Card  } from 'react-bootstrap';
import Auth from '../utils/auth'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import {ADD_COMMENT, UPVOTE_POST, DOWNVOTE_POST } from '../utils/mutations'
import {GET_RECOMMENDED_POSTS, USER_LIKED_POSTS, USER_UNLIKED_POSTS} from '../utils/queries'
import Accordion from 'react-bootstrap/Accordion'
import './ArticlePreview.css'; 

const ArticlePreview = ({ _id, postTitle, postText, postComments, upvotes, downvotes}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatedData, setUpdatedData] = useState({userId: "", commentText: "" })
  
  const [addComment, {error}] = useMutation(ADD_COMMENT, {refetchQueries:[
    GET_RECOMMENDED_POSTS
  ]});
  const [downvotePost] = useMutation(DOWNVOTE_POST, {refetchQueries:[
    USER_UNLIKED_POSTS
 ]})
  const [upvotePost] = useMutation(UPVOTE_POST, {refetchQueries:[
    USER_LIKED_POSTS
  ]})
  
  const {  data:likeData } = useQuery(USER_LIKED_POSTS);
  const  likedPostData = likeData?.userLikedPost?.likedPost || []
  const { data:dislikeData } = useQuery(USER_UNLIKED_POSTS);
  const  unlikedPostData = dislikeData?.userUnlikedPost?.unlikedPost || []

  const updateData= async (event)=>{
    const { name, value } = event.target;
    setUpdatedData({ ...updatedData, [name]: value });
  }

  const commentPost = async(postId)=>{
    try{
      await addComment({
        variables: { 
          commentText: updatedData.commentText,
          postId:postId
          }
      })
      if (error) {
        throw new Error('Unable to update post');
      }
    }catch (err){
      console.error(err)
    }
  }

  const upvote = async (postId) => {
    try{
      await upvotePost({
        variables: { postId:postId }
      })
      if (error) {
        throw new Error('Unable to upvote post');
      }
    }catch (err){
      console.error(err)
    }
  };

  const downvote = async(postId) => {
    try{
      await downvotePost({
        variables: { postId:postId }
      })
      if (error) {
        throw new Error('Unable to downvote post');
      }
    }catch (err){
      console.error(err)
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  let btnTest = "primary";
  let btnTest2 = "primary";
  let likePost =()=>upvote(_id)
  let unlikePost = ()=>downvote(_id)
  let eventKey = -1

  return (
    <>
    <Accordion className="mb-4" defaultActiveKey="0"  >
    <Accordion.Item eventKey={eventKey+1} >
      <Accordion.Header onClick={toggleText}>
      <div className="mb-3 postTitle"> {postTitle}</div>
      <div >{isExpanded ? '' : truncateText(postText, 20)}</div>
      </Accordion.Header>
      <Accordion.Body>
      {postText}
        <div>
          {likedPostData.forEach((likedPosts) => {
                if (likedPosts._id ===_id) {
                  btnTest = "success";
                  likePost=() => void likePost
              } 
          })}

          {unlikedPostData.forEach((unlikedPosts) => {
                if (unlikedPosts._id ===_id) {
                  btnTest2 = "danger";
                  unlikePost=() => void unlikePost
              } 
          })}
          {Auth.loggedIn()?
          <div className=" mt-2 vote-btns">
            <div className='me-2'>
            <Button type="button" className="btn btn-secondary"onClick={likePost} variant={btnTest}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                  <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"></path>
                </svg>
            </Button>
            <p>{upvotes}</p>
            </div>
            <div>
            <Button type="button" className="btn btn-secondary"onClick={unlikePost} variant={btnTest2} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
              <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
            </svg>
            </Button>
            <p>{downvotes}</p>
            </div>
          </div>
          :[]}
          <h5>Comments:</h5>
          {postComments.length  ?  
          <>
            {postComments.map((posts, index) => (
              <Card key={index}  className="mb-4">
              <Card.Body>
                <Card.Text>{posts.commentText}</Card.Text>
              </Card.Body>
            </Card>
            ))}
         </> : 
        <Card >
         <Card.Body>
          <Card.Text>No Comments Yet</Card.Text>
        </Card.Body>
        </Card>}
          {Auth.loggedIn()?
          <>
            <h4 className="mt-4">Add a Comment:</h4>
            <InputGroup className="mt-2">
            <Form.Control
              className="mb-2"
              name='commentText'
              onChange={updateData}
              value={updatedData.commentText}
              /> 
            </InputGroup>
            <Button style={{ background: "#14e956" , border: "black", color:"black"}} onClick={()=>commentPost(_id)}>Post Comment</Button>
          </>:[]}
      </div>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
    </>
  );
};

export default ArticlePreview;

