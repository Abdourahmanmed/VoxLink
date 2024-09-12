import {  CheckCheck } from 'lucide-react';
interface FormErrorProps {
    message?: string;
}
export const FormSucces = ({
    message,
}: FormErrorProps) => {
    if (!message) return null;
    return (
        <div className="bg-green-500/15 rounded-lg flex items-center gap-x-2 text-sm text-green-500 p-2 mt-2">
            < CheckCheck className='h-4 w-4' />
            <p>{message}</p>
        </div>

    )
}