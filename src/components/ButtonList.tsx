import Button from './ui/Button';

function ButtonList() {
    return (
        <>
            <Button
                className="hidden md:flex text-4xl rounded-md mr-4 text-gray-500 hover:bg-gray-200 hover:text-gray-700
           dark:hover:bg-dark-100 dark:hover:text-gray-300"
            ></Button>

            <Button className="shadow-md mt-6 p-2 text-2xl rounded-xl hover:bg-light-100"></Button>
            <Button className="shadow-md p-4 text-2xl rounded-xl hover:bg-light-100 dark:hover:bg-dark-500"></Button>
            <Button className="shadow-md mt-6 p-2  text-2xl rounded-xl hover:bg-light-100"></Button>
            <Button className="shadow-md p-4 text-2xl rounded-xl hover:bg-light-100 dark:hover:bg-dark-500"></Button>
            <Button className="ml-2 hover:underline dark:text-white hover:animate-spin"></Button>
            <Button className="bg-primary text-white hover:bg-[rgb(61,61,236)] p-2 rounded-xl"></Button>
            <Button className="justify-center items-center hidden md:flex bg-dark-500 w-8 h-8 rounded-xl"></Button>
            <Button className="flex items-center justify-center w-full h-10 mt-3 p-2 rounded-xl text-base text-white bg-primary hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"></Button>
            <Button
                className="hidden md:flex text-4xl rounded-md mr-4 text-gray-500 hover:bg-gray-200 hover:text-gray-700
           dark:hover:bg-dark-100 dark:hover:text-gray-300"
            ></Button>
            <Button className="text-3xl dark:text-white"></Button>
            <Button className="relative w-10 h-10 rounded-full bg-secondary dark:bg-dark-500 hover:rotate-12 transition-transform duration-500"></Button>
            <Button className="absolute top-4 right-2 rounded-full flex items-center justify-center text-3xl z-20"></Button>
            <Button className="mt-2 p-2 rounded-xl bg-light-100 hover:bg-gray-400"></Button>
            <Button className="mt-2 p-2 rounded-xl bg-light-100 hover:bg-light-500"></Button>
            <Button className="mt-2 p-2 rounded-xl bg-light-100 hover:bg-gray-400"></Button>
            <Button className="rounded-xl hover:bg-gray-200 dark:hover:bg-gray-500"></Button>
            <Button className="flex items-center  hover:bg-gray-200 w-full p-2 rounded-xl dark:text-primary dark:hover:bg-dark-500"></Button>
            <Button className="p-2 mr-2 bg-red-500 hover:bg-red-700 rounded-md text-white w-[30%]"></Button>
            <Button className="p-2 bg-gray-400 hover:bg-gray-500 rounded-md text-white w-[30%]"></Button>
            <Button className="text-[10px] hover:underline mr-2"></Button>
            <Button className="w-8 text-xs text-black dark:text-white p-1 rounded-t-md"></Button>
            <Button className="flex items-center mt-2 ml-2 text-xs hover:underline"></Button>
            <Button className="justify-start my-2 text-sm text-secondary hover:underline"></Button>
            <Button className="text-xs hover:underline"></Button>
            <Button className="flex items-center bg-secondary w-10 right-0 rounded-r-xl hover:bg-light-100 hover:cursor-pointer px-3 z-10 border-l-2 dark:bg-dark-500 dark:hover:bg-neutral-500"></Button>
            <Button className="flex items-center justify-center w-full h-10 mt-3 p-2 rounded-xl text-base text-white bg-primary hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed"></Button>
            <Button className="mt-1 text-sm text-gray-500 dark:text-gray-500 hover:underline"></Button>
            <Button className="absolute top-2 left-[50%] translate-x-[-50%] z-50 text-white bg-[rgba(0,0,0,0.2)] p-2 rounded-md hover:bg-[(rgba(0,0,0,0.8))]"></Button>
        </>
    );
}
