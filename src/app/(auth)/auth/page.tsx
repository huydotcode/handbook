import { DarkmodeButton } from '@/components/ui';
import React from 'react';
import Form from '../_components/Form';

interface Props {}

const AuthPage: React.FC<Props> = () => {
    return (
        <div className="flex h-screen items-center justify-center px-8 py-12 lg:px-8 sm:px-6">
            <DarkmodeButton className="fixed right-4 top-4" />
            <Form />
        </div>
    );
};
export default AuthPage;
