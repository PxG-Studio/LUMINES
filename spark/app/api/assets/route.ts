import { NextRequest, NextResponse } from 'next/server';
import * as assetOps from '@/lib/database/operations/slate-assets';

export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId query parameter is required' },
        { status: 400 }
      );
    }

    const assets = await assetOps.listAssets(projectId);
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.project_id || !body.name || !body.type) {
      return NextResponse.json(
        { error: 'project_id, name, and type are required' },
        { status: 400 }
      );
    }

    const asset = await assetOps.createAsset({
      project_id: body.project_id,
      name: body.name,
      type: body.type,
      metadata: body.metadata || {},
      file_path: body.file_path || null,
      registry_path: body.registry_path || null,
      guid: body.guid || null,
      file_id: body.file_id || null,
      size: body.size || 0,
      mime_type: body.mime_type || null,
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}

