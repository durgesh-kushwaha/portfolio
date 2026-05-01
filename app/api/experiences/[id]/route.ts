import { NextRequest } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Experience from '../../../../models/Experience';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../../helpers';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const experience = await Experience.findByIdAndUpdate(id, body, { new: true });
    if (!experience) return errorResponse('Experience not found', 404);
    return jsonResponse(experience);
  } catch (error) {
    return errorResponse('Failed to update experience: ' + (error as Error).message, 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) return errorResponse('Experience not found', 404);
    return jsonResponse({ message: 'Experience deleted' });
  } catch (error) {
    return errorResponse('Failed to delete experience: ' + (error as Error).message, 500);
  }
}
