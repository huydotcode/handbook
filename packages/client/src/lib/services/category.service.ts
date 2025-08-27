import {
    createCategory,
    deleteCategory,
    getCategoryBySlug,
} from '../actions/category.action';

class CategoryServiceClass {
    public async create(data: {
        name: string;
        description: string;
        slug: string;
        icon: string;
    }) {
        await createCategory(data);
    }

    public async getBySlug(slug: string) {
        const category = await getCategoryBySlug({ slug });
        return category;
    }

    public async delete(id: string) {
        await deleteCategory(id);
    }
}

const CategoryService = new CategoryServiceClass();
export default CategoryService;
