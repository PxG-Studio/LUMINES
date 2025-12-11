import { NextRequest, NextResponse } from 'next/server';
import * as fileOps from '@/lib/database/operations/files';

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId query parameter is required' },
        { status: 400 }
      );
    }

    const files = await fileOps.listFiles(projectId);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.project_id || !body.path) {
      return NextResponse.json(
        { error: 'project_id and path are required' },
        { status: 400 }
      );
    }

    const file = await fileOps.createFile({
      project_id: body.project_id,
      path: body.path,
      content: body.content || null,
      type: body.type || null,
      encoding: body.encoding || 'utf-8',
    });

    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    );
  }
}

