import { NextRequest } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Project from '../../../../models/Project';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../../helpers';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const project = await Project.findByIdAndUpdate(id, body, { new: true });
    if (!project) return errorResponse('Project not found', 404);
    return jsonResponse(project);
  } catch (error) {
    return errorResponse('Failed to update project: ' + (error as Error).message, 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return errorResponse('Project not found', 404);
    return jsonResponse({ message: 'Project deleted' });
  } catch (error) {
    return errorResponse('Failed to delete project: ' + (error as Error).message, 500);
  }
}
