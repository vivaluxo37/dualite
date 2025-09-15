const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return
    }

    console.log('Existing Blog Posts:')
    console.log('====================')
    
    if (data && data.length > 0) {
      data.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`)
        console.log(`   Slug: ${post.slug}`)
        console.log(`   Status: ${post.status}`)
        console.log(`   Content Length: ${post.content ? post.content.length : 0} characters`)
        console.log(`   Created: ${post.created_at}`)
        if (post.excerpt) {
          console.log(`   Excerpt: ${post.excerpt.substring(0, 100)}...`)
        }
      })
    } else {
      console.log('No blog posts found in the database.')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkBlogPosts()