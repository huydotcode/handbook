const NODE_ENV = process.env.NODE_ENV;

interface Logger {
    message: any;
    type?: 'default' | 'error';
}

export default function logger({ message, type = 'default' }: Logger) {
    if (NODE_ENV != 'production') {
        switch (type) {
            case 'default':
                console.log(message, '\n');
                break;
            case 'error':
                console.warn(message, '\n');
                break;
        }
    }
}
