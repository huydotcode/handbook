import { X } from 'lucide-react';
import { FC, KeyboardEvent, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '../ui/Input';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    className?: string;
}

const TagInput: FC<TagInputProps> = ({
    value,
    onChange,
    placeholder = 'Nhập tag và nhấn Enter',
    maxTags = 10,
    className,
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
            e.preventDefault();

            const newTag = inputValue.trim().replace(/^#/, '').toLowerCase();

            if (!value.includes(newTag) && value.length < maxTags) {
                onChange([...value, newTag]);
            }

            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div
            className={cn(
                'w-full max-w-none rounded-md border border-secondary-2 bg-white px-2 dark:border-dark-secondary-2 dark:bg-dark-secondary-1',
                className
            )}
        >
            {value && value.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {value.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                        >
                            #{tag}
                            <X
                                size={14}
                                className="cursor-pointer hover:text-warning"
                                onClick={() => removeTag(tag)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            <Input
                placeholder={placeholder}
                className="bg-transparent text-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default TagInput;
