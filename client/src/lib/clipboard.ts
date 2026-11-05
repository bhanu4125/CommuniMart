import { toast } from 'sonner';

export const copyToClipboard = async (text: string, label: string = 'Copied to clipboard!') => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch (err) {
    toast.error('Failed to copy to clipboard');
  }
};
