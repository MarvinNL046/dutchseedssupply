import { createServerSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Fetch all categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      // Check if the error is because the table doesn't exist yet
      if (error.code === '42P01') {
        console.log('Categories table does not exist yet. This is normal if no categories have been created.');
        return NextResponse.json({ categories: [] });
      }
      
      console.error('Error fetching categories:', error);
      return NextResponse.json({ 
        error: 'Error fetching categories', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Admin route to create a new category
export async function POST(request: Request) {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Get the request body
    const body = await request.json();
    
    // Validate the request
    if (!body.name) {
      return NextResponse.json({ 
        error: 'Category name is required' 
      }, { status: 400 });
    }
    
    // Generate a slug if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Insert the category
    const { data: category, error } = await supabase
      .from('categories')
      .insert(body)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json({ 
        error: 'Error creating category', 
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error in create category API:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
