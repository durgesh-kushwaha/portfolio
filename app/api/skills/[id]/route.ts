import { NextRequest } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Skill from '../../../../models/Skill';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../../helpers';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const skill = await Skill.findByIdAndUpdate(id, body, { new: true });
    if (!skill) return errorResponse('Skill not found', 404);
    return jsonResponse(skill);
  } catch (error) {
    return errorResponse('Failed to update skill: ' + (error as Error).message, 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const { id } = await params;
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) return errorResponse('Skill not found', 404);
    return jsonResponse({ message: 'Skill deleted' });
  } catch (error) {
    return errorResponse('Failed to delete skill: ' + (error as Error).message, 500);
  }
}
