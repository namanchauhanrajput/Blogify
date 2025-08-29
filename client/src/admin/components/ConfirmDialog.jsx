export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
if (!open) return null;
return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
<div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
<h3 className="text-lg font-semibold mb-1">{title}</h3>
<p className="text-sm text-gray-600 mb-4">{description}</p>
<div className="flex justify-end gap-2">
<button onClick={onCancel} className="px-4 py-2 rounded-lg border">Cancel</button>
<button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white">Confirm</button>
</div>
</div>
</div>
);
}