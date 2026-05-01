import { NextRequest } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import BlogPost from '../../../models/BlogPost';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../helpers';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const limit = parseInt(searchParams.get('limit') || '0');
    const search = searchParams.get('search') || '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    // Only show published posts to public unless ?all=true (admin)
    if (!all) {
      filter.published = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let query = BlogPost.find(filter).sort({ createdAt: -1 });
    if (limit > 0) query = query.limit(limit);

    const posts = await query;
    return jsonResponse(posts);
  } catch (error) {
    return errorResponse('Failed to fetch posts: ' + (error as Error).message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const body = await request.json();

    // Generate slug from title
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const post = await BlogPost.create(body);
    return jsonResponse(post, 201);
  } catch (error) {
    return errorResponse('Failed to create post: ' + (error as Error).message, 500);
  }
}
