// src/components/menu/DeleteConfirmation.tsx
interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  itemName
}: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full">
        <div className="text-center mb-3 sm:mb-4">
          <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center mb-2">Confirm Deletion</h3>
        <p className="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
          Are you sure you want to delete &quot;{itemName}&quot;? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 sm:px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}