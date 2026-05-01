import { NextRequest } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import BlogPost from '../../../../models/BlogPost';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../../helpers';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    // Try to find by ID first, then by slug
    let post = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await BlogPost.findById(id);
    }
    if (!post) {
      post = await BlogPost.findOne({ slug: id });
    }
    if (!post) return errorResponse('Post not found', 404);
    return jsonResponse(post);
  } catch (error) {
    return errorResponse('Failed to fetch post: ' + (error as Error).message, 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    if (body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const post = await BlogPost.findByIdAndUpdate(id, body, { new: true });
    if (!post) return errorResponse('Post not found', 404);
    return jsonResponse(post);
  } catch (error) {
    return errorResponse('Failed to update post: ' + (error as Error).message, 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) return errorResponse('Post not found', 404);
    return jsonResponse({ message: 'Post deleted' });
  } catch (error) {
    return errorResponse('Failed to delete post: ' + (error as Error).message, 500);
  }
}
