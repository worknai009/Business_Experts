import { AlertTriangle } from "lucide-react";

function ErrorCard({ message }) {
  return (
    <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-red-100 p-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-red-700">
            Analysis Failed
          </h2>

          <p className="mt-2 text-red-600">
            {message}
          </p>

          <p className="mt-4 text-sm text-red-500">
            Please verify your input or try again in a few moments.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorCard;