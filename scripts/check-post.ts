import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ppnjdkgukpbwmtlhvgsx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbmpka2d1a3Bid210bGh2Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MzU3NzIsImV4cCI6MjA4MzQxMTc3Mn0.khrfW_NCTSASdbtaspxx4dx-yjpUJP1WdkZJ5zXkIBU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPost() {
  // First try to find the specific post
  const { data: specificPost, error: specificError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', 'welcome-to-our-zen-blog')

  if (specificError) {
    console.error('Error finding specific post:', specificError)
  }

  console.log('Specific post found:', specificPost?.length || 0)

  if (specificPost && specificPost.length > 0) {
    const post = specificPost[0]
    console.log('Post details:', {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content_length: post.content?.length || 0,
      content_preview: post.content?.substring(0, 200) || 'NO CONTENT',
      status: post.status,
      created_at: post.created_at
    })
  }

  // Get all recent posts
  const { data: allPosts, error: allError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (allError) {
    console.error('Error getting all posts:', allError)
    return
  }

  console.log('\nAll recent posts:')
  allPosts.forEach((post, i) => {
    console.log(`\n${i + 1}. ${post.title}`)
    console.log(`   Slug: ${post.slug}`)
    console.log(`   Content length: ${post.content?.length || 0}`)
    console.log(`   Status: ${post.status}`)
    console.log(`   Created: ${post.created_at}`)
  })
}

checkPost()
