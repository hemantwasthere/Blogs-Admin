import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

interface DashboardPageProps {
    params: {
        storeId: string;
    };
};

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const { userId } = auth();

    const stores = await prismadb.store.findMany({
        where: {
            userId: userId!,
        }
    });

    return (
        <div className="flex-col">
            <p>ACTIVE STORE: </p>{stores[0].name}
        </div>
    );
};

export default DashboardPage;