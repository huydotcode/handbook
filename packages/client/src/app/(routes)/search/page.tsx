import Search from './_components/Search';

interface SearchPageProps {
    searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
    const params = (await searchParams) || {};
    const query = params.q || '';

    return {
        title: `Tìm kiếm "${query}" | Handbook`,
        description: `Tìm kiếm người dùng, nhóm và bài viết trên Handbook với từ khóa "${query}"`,
    };
}

export const dynamic = 'force-dynamic';

const SearchPage = async () => {
    return <Search />;
};

export default SearchPage;
