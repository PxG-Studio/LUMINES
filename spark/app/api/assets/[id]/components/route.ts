import { NextRequest, NextResponse } from 'next/server';
import * as assetOps from '@/lib/database/operations/slate-assets';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    if (!body.component_type) {
      return NextResponse.json(
        { error: 'component_type is required' },
        { status: 400 }
      );
    }

    // Verify asset exists
    const asset = await assetOps.getAsset(params.id);
    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    const component = await assetOps.createAssetComponent({
      asset_id: params.id,
      component_type: body.component_type,
      component_name: body.component_name || null,
      properties: body.properties || {},
      editable: body.editable ?? true,
      order_index: body.order_index || 0,
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error('Error creating asset component:', error);
    return NextResponse.json(
      { error: 'Failed to create asset component' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const components = await assetOps.listAssetComponents(params.id);
    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching asset components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset components' },
      { status: 500 }
    );
  }
}

