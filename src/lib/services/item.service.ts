import {
    createItem,
    deleteItem,
    getItemById,
    getItemsByCategoryId,
    getItemsBySeller,
    updateItem,
} from '../actions/item.action';

interface IItemService {
    create({
        name,
        seller,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
    }: {
        name: string;
        seller: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
    }): Promise<IItem>;
    getById(itemId: string): Promise<IItem>;
    getBySeller(seller: string): Promise<IItem[]>;
    getItemsByCategoryId(categoryId: string): Promise<IItem[]>;
    update({
        itemId,
        name,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
        path,
    }: {
        itemId: string;
        name: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
        path: string;
    }): Promise<boolean>;
    delete({
        itemId,
        path,
    }: {
        itemId: string;
        path: string;
    }): Promise<boolean>;
}

class ItemServiceClass implements IItemService {
    async create({
        name,
        seller,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
    }: {
        name: string;
        seller: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
    }): Promise<IItem> {
        console.log('[LIB-SERVICES] create item');
        const item = await createItem({
            name,
            seller,
            description,
            price,
            imagesIds,
            location,
            category,
            status,
        });

        return item;
    }

    async getById(itemId: string): Promise<IItem> {
        console.log('[LIB-SERVICES] get item by id');
        const item = await getItemById({ id: itemId });

        return item;
    }

    async getBySeller(seller: string): Promise<IItem[]> {
        console.log('[LIB-SERVICES] get items by seller');
        const items = await getItemsBySeller({ seller });

        return items;
    }

    async getItemsByCategoryId(categoryId: string): Promise<IItem[]> {
        console.log('[LIB-SERVICES] get items by category id');
        const items = await getItemsByCategoryId({ categoryId });

        return items;
    }

    async update({
        itemId,
        name,
        description,
        price,
        imagesIds,
        location,
        category,
        status,
        path,
    }: {
        itemId: string;
        name: string;
        description: string;
        price: number;
        imagesIds: string[];
        location: string;
        category: string;
        status: string;
        path: string;
    }): Promise<boolean> {
        console.log('[LIB-SERVICES] update item');
        const result = await updateItem({
            itemId,
            name,
            description,
            price,
            imagesIds,
            location,
            category,
            status,
            path,
        });

        return result;
    }

    async delete({
        itemId,
        path,
    }: {
        itemId: string;
        path: string;
    }): Promise<boolean> {
        console.log('[LIB-SERVICES] delete item');
        const result = await deleteItem({
            itemId,
            path,
        });

        return result;
    }
}

const ItemService = new ItemServiceClass();
export default ItemService;
