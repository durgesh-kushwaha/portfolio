import { NextRequest } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Project from '../../../models/Project';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../helpers';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return jsonResponse(projects);
  } catch (error) {
    return errorResponse('Failed to fetch projects: ' + (error as Error).message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const body = await request.json();
    const project = await Project.create(body);
    return jsonResponse(project, 201);
  } catch (error) {
    return errorResponse('Failed to create project: ' + (error as Error).message, 500);
  }
}
