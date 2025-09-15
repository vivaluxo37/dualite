const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://efxpwrnxdorgzcqhbnfn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeHB3cm54ZG9yZ3pjcWhibmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzMyMzUsImV4cCI6MjA3MjYwOTIzNX0.q2qAWQgNE1lTCTA8MBdzeNCm5rtL5a_7o4E1Hf_tmzQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Error:', error)
      return
    }

    if (data && data.length > 0) {
      console.log('Table columns:')
      console.log('===============')
      Object.keys(data[0]).forEach(column => {
        console.log(`- ${column}`)
      })
    } else {
      console.log('No data found in blog_posts table')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

checkTableStructure()