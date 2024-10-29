import React from 'react';

interface FormProps {
    children: React.ReactNode;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
    ({ children }, ref) => {
        return (
            <form
                ref={ref}
                className="flex flex-col space-y-4"
                onSubmit={(e) => e.preventDefault()}
            >
                {children}
            </form>
        );
    }
);

export default Form;
