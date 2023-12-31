const typeDefs = `#graphql
  type User {
    _id: ID
    firstName: String
    lastName: String
    username: String
    role:String
    likedPost:[Post]
    unlikedPost:[Post]
    posts: [Post]
    comments: [Comment]
    likedKeywords: [KeywordCount] # Define it as an array of KeywordCount
  }
  type KeywordCount {
    keyword: String
    count: Int
  }
  type Post{
    _id:ID 
    postTitle:String
    postText:String
    pictureLink:String
    author: User
    postComments: [Comment]
    createdAt: String
    updatedAt: String
    tags: [String]
    upvotes: Int
    downvotes:Int
  }
  type Comment{
    _id:ID
    commentText: String
    author: User
    createdAt:String
  }
  input PostInput{
    postTitle:String
    postText:String
    pictureLink:String
    createdAt: String
    tags: [String]
  }
  input UserInput{
    firstName:String
    lastName:String
    username:String
    password:String
    role:String
  }
  type Auth {
    token: ID
  }
  type Query {
    users: [User]
    userLikedPost:User
    userUnlikedPost:User
    basicUser:[User]
    posts: [Post]
    comments:[Comment]
    getRecommendedPosts: [Post]
    recentPosts: [Post]
  }
  type Mutation {
    addUser(user:UserInput): Auth
    login(username: String, password: String): Auth
    updateUser(criteria:UserInput):User
    deleteUser:User
    adminDelete(userId:ID):User
    addPost(postTitle:String, postText:String, tags:[String]):Post
    updatePost(criteria: PostInput, postId:ID):Post
    deletePost(postId:ID):Post
    addComment(commentText:String, postId:ID):Comment
    updateComment(commentId:ID, commentText:String):Comment
    deleteComment(commentId:ID):Comment
    upvotePost(postId:ID): Post
    downvotePost(postId:ID):Post
  }
`;
module.exports = typeDefs;
// role needs to be updatable to admin??- graphQL shield certain variables on routes??
// add if else with role variable if admin??
