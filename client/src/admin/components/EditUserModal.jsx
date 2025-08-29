import { useEffect, useState } from "react";


export default function EditUserModal({ open, onClose, onSubmit, initial }) {
const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", isAdmin: false });


useEffect(() => {
if (initial) setForm({
name: initial.name || "",
username: initial.username || "",
email: initial.email || "",
phone: initial.phone || "",
isAdmin: !!initial.isAdmin,
});
}, [initial]);


if (!open) return null;


return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
<div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
<h3 className="text-lg font-semibold mb-4">Edit User</h3>
<div className="grid gap-3">
<div>
<label className="text-sm">Name</label>
<input className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
<div>
<label className="text-sm">Username</label>
<input className="w-full border rounded-lg px-3 py-2" value={form.username} onChange={(e)=>setForm({...form,username:e.target.value})} />
</div>
<div>
<label className="text-sm">Phone</label>
<input className="w-full border rounded-lg px-3 py-2" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
</div>
</div>
<div>
<label className="text-sm">Email</label>
<input type="email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
</div>
<label className="inline-flex items-center gap-2 mt-1">
<input type="checkbox" checked={form.isAdmin} onChange={(e)=>setForm({...form,isAdmin:e.target.checked})} />
<span>Is Admin</span>
</label>
</div>
<div className="mt-5 flex justify-end gap-2">
<button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
<button onClick={()=>onSubmit(form)} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Save</button>
</div>
</div>
</div>
);
}