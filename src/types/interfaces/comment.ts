export interface CommentRequest {
  content: string,
  exerciseId: string,
}

export interface CommentResponse {
  content: string,
  exerciseId: string,
  upvote: number,
  downvote: number,
  createdAt: string,
  updatedAt: string,
  username: string
}