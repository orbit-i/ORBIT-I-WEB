import { NextResponse } from 'next/server';
import { updateBlogPost, deleteBlogPost } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateBlogPost(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    await deleteBlogPost(id);
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete blog post' }, { status: 500 });
  }
}
