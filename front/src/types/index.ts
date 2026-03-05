export interface ReqResUser {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

export interface SavedUser {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar: string
  savedAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  authorUserId: number
  author?: SavedUser | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedPosts {
  data: Post[]
  total: number
  page: number
  totalPages: number
}

export interface PaginatedReqResUsers {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: ReqResUser[]
}

export interface AuthState {
  token: string | null
  email: string | null
  isAuthenticated: boolean
}

export interface UsersState {
  reqresUsers: ReqResUser[]
  savedUsers: SavedUser[]
  selectedUser: ReqResUser | null
  currentPage: number
  totalPages: number
  searchQuery: string
  loading: boolean
  error: string | null
}

export interface PostsState {
  posts: Post[]
  selectedPost: Post | null
  currentPage: number
  totalPages: number
  total: number
  loading: boolean
  error: string | null
}
