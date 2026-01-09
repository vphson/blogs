import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ppnjdkgukpbwmtlhvgsx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbmpka2d1a3Bid210bGh2Z3N4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzgzNTc3MiwiZXhwIjoyMDgzNDExNzcyfQ.W7hCQ9z8YcDGQQPjjdc2IX8KkQQxTLKZRF4J3bVZp5'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestAdmin() {
  try {
    // Create a test user with email/password
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test-admin@example.com',
      password: 'Test123456!',
      email_confirm: true,
    })

    if (error) {
      console.error('Error creating user:', error)
      return
    }

    console.log('Test admin created successfully!')
    console.log('Email: test-admin@example.com')
    console.log('Password: Test123456!')
    console.log('User ID:', data.user.id)
  } catch (err) {
    console.error('Error:', err)
  }
}

createTestAdmin()
