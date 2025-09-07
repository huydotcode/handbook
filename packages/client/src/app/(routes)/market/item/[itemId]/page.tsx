import { MessageAction } from '@/components/shared';
import { getAuthSession } from '@/lib/auth';
import ItemService from '@/lib/services/item.service';
import { formatMoney } from '@/utils/formatMoney';
import Image from 'next/image';
import ListItem from '../../_components/ListItem';
import SwiperImagesItem from '../../_components/SwiperImagesItem';

interface Props {
    params: Promise<{ itemId: string }>;
}

export default async function ItemPage({ params }: Props) {
    const session = await getAuthSession();

    const { itemId } = await params;
    const item: IItem = await ItemService.getById(itemId);

    const itemsOther = await ItemService.getBySeller(item.seller._id);
    const isOwner = session?.user?.id === item.seller._id;

    return (
        <div
            className={
                'flex h-full w-full rounded-xl bg-secondary-1 px-4 py-2 dark:bg-dark-secondary-1'
            }
        >
            <div className={'flex w-full justify-between 2xl:flex-col'}>
                {/* Left */}
                <div
                    className={
                        'h-[calc(100vh-80px)] w-full max-w-[50vw] rounded-xl border p-2 dark:border-none 2xl:h-[300px] 2xl:max-w-full'
                    }
                >
                    <SwiperImagesItem images={item.images} />
                </div>

                {/* Right */}
                <div
                    className={
                        'ml-4 h-full flex-1 overflow-scroll xl:ml-0 xl:mt-2'
                    }
                >
                    <h1 className={'text-3xl font-bold'}>{item.name}</h1>

                    <p className="mt-2 text-xl font-bold text-primary-1 dark:text-dark-primary-1">
                        {formatMoney(item.price)}
                    </p>

                    <div className="mt-2 rounded-xl border p-2 dark:border-none">
                        <h5 className={'text-lg font-bold'}>Chi tiết</h5>

                        <ul className="ml-4 list-disc">
                            <li>
                                <p className={'text-sm'}>
                                    <b>Mô tả: </b>
                                    {item.description}
                                </p>
                            </li>

                            <li>
                                <p className={'text-sm'}>
                                    <b>Tình trạng: </b>{' '}
                                    {item.status == 'active'
                                        ? 'Còn hàng'
                                        : 'Hết hàng'}
                                </p>
                            </li>

                            <li>
                                <p className={'text-sm'}>
                                    <b>Địa chỉ: </b> {item.location.name}
                                </p>
                            </li>

                            <li>
                                <p className={'text-sm'}>
                                    <b>Cập nhật: </b>
                                    {new Date(item.updatedAt).toDateString()}
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-2 flex items-center">
                        {!isOwner && (
                            <MessageAction messageTo={item.seller._id} />
                        )}
                    </div>

                    <div className="mt-2 rounded-xl border p-2 dark:border-none">
                        <h5 className={'mt-2 text-lg font-bold'}>
                            Thông tin người bán
                        </h5>
                        <div className="flex items-center">
                            <Image
                                src={item.seller.avatar}
                                alt={item.seller.name}
                                width={50}
                                height={50}
                                className={'rounded-full'}
                            />

                            <p className={'ml-2'}>{item.seller.name}</p>
                        </div>

                        <h5 className={'text-md mt-2'}>
                            Mặt hàng khác của {item.seller.name}
                        </h5>

                        <ListItem
                            className="mt-2"
                            itemClassName="w-[200px] h-[400px]"
                            data={
                                itemsOther
                                    .filter((i: IItem) => i._id !== item._id)
                                    .slice(0, 4) || []
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
