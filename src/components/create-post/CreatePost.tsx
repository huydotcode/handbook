import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, {
    BaseSyntheticEvent,
    createContext,
    useCallback,
    useContext,
    useState,
} from 'react';
import {
    Control,
    FormState,
    SubmitHandler,
    UseFormRegister,
    useForm,
} from 'react-hook-form';
import ModalCreatePost from './ModalCreatePost';

interface Props {}

interface IFormData {
    option: 'public' | 'friend' | 'private';
    content: string;
    pictures: any[];
}

interface ICreatePostContext {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleCloseModal: () => void;
    register: UseFormRegister<IFormData>;
    submitForm: (
        e?: BaseSyntheticEvent<object, any, any> | undefined
    ) => Promise<void>;
    photos: any[];
    setPhotos: React.Dispatch<React.SetStateAction<any[]>>;
    formState: FormState<IFormData>;
    control: Control<IFormData, any>;
}

const initContext = {};
export const CreatePostContext = createContext<ICreatePostContext | null>(null);
export function useCreatePostContext() {
    return useContext(CreatePostContext) as ICreatePostContext;
}

const CreatePost: React.FC<Props> = ({}) => {
    const { data: session } = useSession();

    // Data function
    const { control, register, handleSubmit, formState, reset } =
        useForm<IFormData>({
            defaultValues: {
                option: 'public',
            },
        });
    const [photos, setPhotos] = useState<any[]>([]);

    // Modal function
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleShowModal = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    const submitFormHandle: SubmitHandler<IFormData> = (formData) => {};
    const submitForm = handleSubmit(submitFormHandle);

    const valuesContext = {
        setShowModal,
        handleCloseModal,
        register,
        submitForm,
        showModal,
        photos,
        setPhotos,
        formState,
        control,
    };

    return (
        <CreatePostContext.Provider value={valuesContext}>
            <div className="my-4 py-2 px-4 rounded-xl shadow-md min-w-[200px] bg-white dark:bg-dark-200">
                <div className="flex items-center">
                    <Link
                        className="w-10 h-10"
                        href={`/profile/${session?.user.id}`}
                    >
                        <Image
                            className="w-full h-full object-cover rounded-full"
                            width={40}
                            height={40}
                            src={session?.user.image || ''}
                            alt={session?.user.name || ''}
                        />
                    </Link>
                    <div
                        className="flex items-center h-10 flex-1 rounded-xl ml-3 px-3 cursor-text bg-secondary dark:bg-dark-500"
                        onClick={handleShowModal}
                    >
                        <h5 className="text-gray-400 dark:text-primary">
                            Bạn đang nghĩ gì thế?
                        </h5>
                    </div>
                </div>
            </div>

            {showModal && <ModalCreatePost />}
        </CreatePostContext.Provider>
    );
};
export default CreatePost;
