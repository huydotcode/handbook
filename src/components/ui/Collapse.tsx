'use client';
import React, { useState } from 'react';
import { Icons } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CollapseProps {
    className?: string;
    items: {
        key: string;
        label: string;
        children: React.ReactNode;
    }[];
}

const Collapse: React.FC<CollapseProps> = ({ className, items }) => {
    const [activeKey, setActiveKey] = useState<string[]>([]);

    // Xử lý sự kiện khi click vào button
    const onActiveChange = (key: string) => {
        if (activeKey.includes(key)) {
            setActiveKey(activeKey.filter((k) => k !== key));
        } else {
            setActiveKey([...activeKey, key]);
        }
    };

    return (
        <div className={cn(className)}>
            {items.map((item) => (
                <div key={item.key} className="mb-2">
                    <Button
                        className="w-full justify-between"
                        variant="event"
                        onClick={() => onActiveChange(item.key)}
                    >
                        <span>{item.label}</span>
                        <span>
                            {activeKey.includes(item.key) ? (
                                <Icons.ArrowUp className="h-4 w-4" />
                            ) : (
                                <Icons.ArrowDown className="h-4 w-4" />
                            )}
                        </span>
                    </Button>
                    <div
                        className={cn(
                            'pt-2',
                            activeKey.includes(item.key) ? 'block' : 'hidden'
                        )}
                    >
                        {item.children}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Collapse;
