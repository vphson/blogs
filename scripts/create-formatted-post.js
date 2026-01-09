const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppnjdkgukpbwmtlhvgsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbmpka2d1a3Bid210bGh2Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MzU3NzIsImV4cCI6MjA4MzQxMTc3Mn0.khrfW_NCTSASdbtaspxx4dx-yjpUJP1WdkZJ5zXkIBU';

const supabase = createClient(supabaseUrl, supabaseKey);

const formattedContent = `<p>This is <strong>bold text</strong> and this is <em>italic text</em>. We can also <u>underline</u> important points.</p>

<h2>Why Formatting Matters</h2>

<p>Formatting helps <strong>emphasize</strong> key points and makes content <em>more readable</em>.</p>

<blockquote>
As <a href="https://en.wikipedia.org/wiki/Marcus_Aurelius">Marcus Aurelius</a> once said, "The happiness of your life depends upon the quality of your thoughts."
</blockquote>

<h3>Key Takeaways</h3>

<ul>
<li>Write with <strong>intention</strong> and clarity</li>
<li>Use formatting to <em>emphasize</em> key points</li>
<li>Add <a href="https://example.com/resources">links</a> to resources</li>
</ul>

<p>Thank you for reading. May your words flow with <strong>ease and grace</strong>!</p>`;

async function createPost() {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: 'The Art of Mindful Writing',
      slug: 'the-art-of-mindful-writing',
      content: formattedContent,
      excerpt: 'Discover how intentional writing and proper formatting can transform your thoughts into powerful expressions.',
      status: 'PUBLISHED'
    })
    .select();

  if (error) {
    console.error('Error creating post:', error);
    return;
  }

  console.log('✅ Formatted post created successfully!');
  console.log('Post ID:', data[0].id);
  console.log('Title:', data[0].title);
  console.log('Slug:', data[0].slug);
  console.log('Content length:', data[0].content.length);
}

createPost();
