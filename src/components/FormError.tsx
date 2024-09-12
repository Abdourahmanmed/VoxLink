import { TriangleAlert } from 'lucide-react';
interface FormErrorProps {
    message?: string;
}
export const FormError = ({
    message,
}: FormErrorProps) => {
    if (!message) return null;
    return (
        <div className="bg-red-500/15 rounded-lg flex items-center gap-x-2 text-sm text-red-500 p-2 mt-2">
            <TriangleAlert className='h-4 w-4' />
            <p>{message}</p>
        </div>

    )
}