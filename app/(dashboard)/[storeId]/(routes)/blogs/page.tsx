import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { BillboardClient } from "./components/client";
import { BlogColumn } from "./components/columns";

const BlogsPage = async ({ params }: { params: { storeId: string } }) => {

    const blogs = await prismadb.blog.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBlogs: BlogColumn[] = blogs.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        createdAt: format(item.createdAt, 'MMMM do, yyyy, hh:mm a'), // hh:mm:ss a dd/LL/yyyy O
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBlogs} />
            </div>
        </div>
    );
};

export default BlogsPage;
