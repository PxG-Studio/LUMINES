import { NextRequest, NextResponse } from 'next/server';
import * as projectOps from '@/lib/database/operations/slate-projects';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const projects = await projectOps.listProjects(userId);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.user_id || !body.name) {
      return NextResponse.json(
        { error: 'user_id and name are required' },
        { status: 400 }
      );
    }

    const project = await projectOps.createProject({
      user_id: body.user_id,
      name: body.name,
      description: body.description || null,
      metadata: body.metadata || {},
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

