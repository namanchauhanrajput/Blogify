import { useEffect, useState } from "react";


export default function EditBlogModal({ open, onClose, onSubmit, initial }) {
const [form, setForm] = useState({ title: "", content: "" });
useEffect(() => {
if (initial) setForm({ title: initial.title || "", content: initial.content || "" });
}, [initial]);
if (!open) return null;
return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
<div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
<h3 className="text-lg font-semibold mb-4">Edit Blog</h3>
<div className="grid gap-3">
<div>
<label className="text-sm">Title</label>
<input className="w-full border rounded-lg px-3 py-2" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
</div>
<div>
<label className="text-sm">Content</label>
<textarea rows={8} className="w-full border rounded-lg px-3 py-2" value={form.content} onChange={(e)=>setForm({...form,content:e.target.value})} />
</div>
</div>
<div className="mt-5 flex justify-end gap-2">
<button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
<button onClick={()=>onSubmit(form)} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Save</button>
</div>
</div>
</div>
);
}