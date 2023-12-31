import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();

        const body = await req.json();

        const { title, author, imageUrl, content, isFeatured } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

        if (!title) return new NextResponse("Title is required", { status: 400 });

        if (!content) return new NextResponse("Content is required", { status: 400 });

        if (!author) return new NextResponse("Author is required", { status: 400 });

        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

        // Checking if the store of the logged in user exists or user trying to create blog of another user's store
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 405 });

        const blog = await prismadb.blog.create({
            data: {
                title,
                author,
                content,
                imageUrl,
                isFeatured,
                storeId: params.storeId,
            }
        });

        return NextResponse.json(blog);
    } catch (error) {
        console.log('[BLOGS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url)
        const isFeatured = searchParams.get('isFeatured');

        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

        let blogs;

        if (isFeatured) {
            blogs = await prismadb.blog.findMany({
                where: {
                    storeId: params.storeId,
                    isFeatured: isFeatured === 'true' ? true : false,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        } else {
            blogs = await prismadb.blog.findMany({
                where: {
                    storeId: params.storeId,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        }

        return NextResponse.json(blogs);
    } catch (error) {
        console.log('[BLOGS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
