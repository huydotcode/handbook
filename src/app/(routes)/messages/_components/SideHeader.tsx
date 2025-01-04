import { Button, Icons } from '@/components/ui';

interface Props {
    handleClickBack: () => void;
    title?: string;
}

const SideHeader: React.FC<Props> = ({ handleClickBack, title }) => {
    return (
        <div className="flex h-16 items-center border-b p-4 dark:border-dark-secondary-2">
            <Button
                className="hidden md:block"
                onClick={handleClickBack}
                variant={'event'}
            >
                <Icons.ArrowBack size={24} />
            </Button>

            {title && <h1>{title}</h1>}
        </div>
    );
};

export default SideHeader;
