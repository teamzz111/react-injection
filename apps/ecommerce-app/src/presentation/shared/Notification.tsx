import { AlertTriangle, Check } from "lucide-react";
import { memo } from "react";

export const NotificationComponent = memo(
  ({
    show,
    type,
    message,
  }: {
    show: boolean;
    type: "success" | "error";
    message: string;
  }) => {
    if (!show) return null;

    return (
      <div
        className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md flex items-center ${
          type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        {type === "success" ? (
          <Check className="text-green-500 mr-2" size={20} />
        ) : (
          <AlertTriangle className="text-red-500 mr-2" size={20} />
        )}
        <p
          className={`${
            type === "success" ? "text-green-700" : "text-red-700"
          }`}
        >
          {message}
        </p>
      </div>
    );
  }
);
