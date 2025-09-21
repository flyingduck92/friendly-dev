import type { PostMeta, StrapiResponse, StrapiPost } from '~/type'
import type { Route } from './+types'
import PostCard from '~/components/PostCard'

import { useState } from 'react'
import Pagination from '~/components/Pagination'
import PostFilter from '~/components/PostFilter'

export async function loader({ request }: Route.LoaderArgs): Promise<{ posts: PostMeta[] }> {

  const res = await fetch(`${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`)

  if (!res.ok) throw new Error('Failed to fetch')

  const json: StrapiResponse<StrapiPost> = await res.json()

  const posts = json.data.map((item) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    slug: item.slug,
    date: item.date,
    body: item.body,
    image: item.image?.url
      ? `${import.meta.env.VITE_STRAPI_URL}${item.image.url}`
      : '/images/no-image.png',
  }))

  return { posts }
}

const Blog = ({ loaderData }: Route.ComponentProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { posts } = loaderData
  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase()
    return (
      post.title.toLowerCase().includes(query)
      || post.excerpt.toLowerCase().includes(query)
    )
  })

  const postPerPage = 10
  const totalPages = Math.ceil(filteredPosts.length / postPerPage)
  const indexOfLast = currentPage * postPerPage
  const indexOfFirst = indexOfLast - postPerPage

  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast)

  return (
    <div className='max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900 '>
      <h2 className="text-3xl font-bold text-white mb-8">
        📰Blog
      </h2>

      <PostFilter
        searchQuery={searchQuery}
        onSearchChange={query => {
          setSearchQuery(query)
          setCurrentPage(1)
        }} />

      <div className="space-y-8">
        {currentPosts.length < 1 ?
          <p className="text-gray-400 text-center">No post found</p>
          :
          currentPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))
        }
      </div>

      {
        totalPages > 1 &&
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page => setCurrentPage(page)}
        />
      }
    </div>
  )
}

export default Blog