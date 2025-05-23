import { toast } from 'sonner';

type ToastOptions = {
  description?: string;
  duration?: number;
  variant?: 'default' | 'success' | 'destructive';
};

function showToast (title: string, options?: ToastOptions) {
  switch (options?.variant) {
    case 'success':
      return toast.success(title, options);
    case 'destructive':
      return toast.error(title, options);
    default:
      return toast(title, options);
  }
};

export default showToast