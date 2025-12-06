import { NextRequest, NextResponse } from 'next/server';
import * as assetOps from '@/lib/database/operations/slate-assets';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await assetOps.getAsset(params.id);

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const asset = await assetOps.updateAsset(params.id, {
      name: body.name,
      type: body.type,
      metadata: body.metadata,
      file_path: body.file_path,
      registry_path: body.registry_path,
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    
    if (error instanceof Error && error.message === 'Asset not found') {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await assetOps.deleteAsset(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}

