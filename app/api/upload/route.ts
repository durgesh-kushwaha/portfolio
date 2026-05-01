import { NextRequest } from 'next/server';
import cloudinary from '../../../lib/cloudinary';
import { isAuthenticated, jsonResponse, errorResponse, unauthorizedResponse } from '../helpers';

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'portfolio';

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `portfolio/${folder}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadResult = result as any;

    return jsonResponse({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (error) {
    return errorResponse('Upload failed: ' + (error as Error).message, 500);
  }
}
