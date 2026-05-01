import { NextRequest } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Skill from '../../../models/Skill';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../helpers';

export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find({}).sort({ order: 1, createdAt: -1 });
    return jsonResponse(skills);
  } catch (error) {
    return errorResponse('Failed to fetch skills: ' + (error as Error).message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();
    await dbConnect();
    const body = await request.json();
    const skill = await Skill.create(body);
    return jsonResponse(skill, 201);
  } catch (error) {
    return errorResponse('Failed to create skill: ' + (error as Error).message, 500);
  }
}
