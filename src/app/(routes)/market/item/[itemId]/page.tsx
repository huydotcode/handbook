import { MessageAction } from '@/components/shared';
import { getItemById, getItemsBySeller } from '@/lib/actions/item.action';
import { getAuthSession } from '@/lib/auth';
import { formatMoney } from '@/utils/formatMoney';
import Image from 'next/image';
import Item from '../../_components/Item';
import SwiperImagesItem from '../../_components/SwiperImagesItem';

interface Props {
    params: Promise<{ itemId: string }>;
}

export default async function ItemPage({ params }: Props) {
    const session = await getAuthSession();

    const { itemId } = await params;
    const item: IItem = await getItemById({ id: itemId });

    const itemsOther = await getItemsBySeller({
        seller: item.seller._id,
    });
    const isOwner = session?.user?.id === item.seller._id;

    return (
        <div className={'flex h-full w-full bg-secondary-1 px-4 py-2'}>
            <div
                className={
                    'flex h-[calc(100vh-80px)] w-full justify-between xl:block xl:h-full'
                }
            >
                {/* Left */}
                <div
                    className={
                        'max-h-screen min-w-[500px] max-w-[40vw] rounded-xl border p-2 dark:border-none xl:h-[50vh] xl:max-w-screen'
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
                    <h1 className={'text-xl font-bold'}>{item.name}</h1>

                    <p className="mt-2 text-base font-bold text-primary-1 dark:text-dark-primary-1">
                        {formatMoney(item.price)}
                    </p>

                    <h5 className={'mt-2 text-lg font-bold'}>Chi tiết</h5>

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

                            <p className={'ml-2 text-sm text-secondary-1'}>
                                {item.seller.name}
                            </p>
                        </div>
                        <h5 className={'text-md mt-2'}>Mặt hàng khác</h5>

                        <div className={'grid grid-cols-2 gap-2'}>
                            {itemsOther
                                .filter((i: IItem) => i._id !== item._id)
                                .slice(0, 4)
                                .map((item: IItem) => (
                                    <Item data={item} key={item._id} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
