import { NextRequest } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Experience from '../../../models/Experience';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../helpers';

export async function GET() {
  try {
    await dbConnect();
    const experiences = await Experience.find({}).sort({ order: 1, createdAt: -1 });
    return jsonResponse(experiences);
  } catch (error) {
    return errorResponse('Failed to fetch experiences: ' + (error as Error).message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const body = await request.json();
    const experience = await Experience.create(body);
    return jsonResponse(experience, 201);
  } catch (error) {
    return errorResponse('Failed to create experience: ' + (error as Error).message, 500);
  }
}
