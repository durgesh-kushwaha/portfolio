import { NextRequest } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import About from '../../../models/About';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../helpers';

export async function GET() {
  await dbConnect();
  let about = await About.findOne();
  if (!about) {
    about = await About.create({});
  }
  return jsonResponse(about);
}

export async function PUT(request: NextRequest) {
  const auth = await isAuthenticated();
  if (!auth) return unauthorizedResponse();

  await dbConnect();
  const body = await request.json();

  let about = await About.findOne();
  if (!about) {
    about = await About.create(body);
  } else {
    Object.assign(about, body);
    await about.save();
  }
  return jsonResponse(about);
}
