import { toast } from "sonner";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {});
  },

  error: (message: string) => {
    toast.error(message, {
      dismissible: true,
      duration: Infinity,
    });
  },

  successWithAction: (
    message: string,
    actionLabel: string,
    action: () => void,
  ) => {
    toast.success(message, {
      action: {
        label: actionLabel,
        onClick: action,
      },
      duration: 8000,
    });
  },
};
