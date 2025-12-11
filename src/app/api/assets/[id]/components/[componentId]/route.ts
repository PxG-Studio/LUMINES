import { NextRequest, NextResponse } from 'next/server';
import * as assetOps from '@/lib/database/operations/assets';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; componentId: string } }
) {
  try {
    const body = await request.json();
    
    if (!body.properties) {
      return NextResponse.json(
        { error: 'properties is required' },
        { status: 400 }
      );
    }

    const component = await assetOps.updateAssetComponent(
      params.componentId,
      body.properties
    );

    return NextResponse.json(component);
  } catch (error) {
    console.error('Error updating asset component:', error);
    
    if (error instanceof Error && error.message === 'Component not found') {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update asset component' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; componentId: string } }
) {
  try {
    await assetOps.deleteAssetComponent(params.componentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting asset component:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset component' },
      { status: 500 }
    );
  }
}

