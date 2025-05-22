import { toast } from 'sonner';

type ToastOptions = {
    description?: string;
    duration?: number;
};

export const useToast = () => {
    return {
        toast: (
            title: string,
            options?: ToastOptions & { variant?: 'default' | 'success' | 'destructive' }
        ) => {
            switch (options?.variant) {
                case 'success':
                    return toast.success(title, options);
                case 'destructive':
                    return toast.error(title, options);
                default:
                    return toast(title, options);
            }
        },
    };
};