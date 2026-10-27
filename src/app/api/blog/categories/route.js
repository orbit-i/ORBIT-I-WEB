import { NextResponse } from 'next/server';
import { getBlogCategories, saveBlogCategory, deleteBlogCategory } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const categories = await getBlogCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const newCategory = await saveBlogCategory(body);
    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await deleteBlogCategory(id);
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
