"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/features/ui/toast";
import { useToast } from "@/features/ui/use-toast";
import {
  CircleCheckIcon,
  TriangleAlertIcon,
  InfoIcon,
  CircleAlertIcon,
} from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex gap-x-2">
              {props.variant === "success" && (
                <CircleCheckIcon className="w-5 h-5" />
              )}
              {props.variant === "error" && (
                <CircleAlertIcon className="w-5 h-5" />
              )}
              {props.variant === "warning" && (
                <TriangleAlertIcon className="w-5 h-5" />
              )}
              {props.variant === "info" && <InfoIcon className="w-5 h-5" />}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
