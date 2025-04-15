import { useState } from 'react';

export default function DonateBook() {
  const [form, setForm] = useState({
    name: '',
    publishingYear: '',
    quantity: 1,
    condition: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    donorAddress: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit donation');
      }
      setSuccess('Thank you for your donation!');
      setForm({
        name: '', publishingYear: '', quantity: 1, condition: '', donorName: '', donorEmail: '', donorPhone: '', donorAddress: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded shadow mt-12">
      {success ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-3xl font-bold text-green-700 mb-6">Thank you for your donation!</h2>
          <p className="text-lg text-gray-700 mb-4 text-center">We appreciate your generous contribution. Your donation will help us grow our library and reach more readers!</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Donate a Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Book Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium">Publishing Year</label>
              <input name="publishingYear" value={form.publishingYear} onChange={handleChange} required type="number" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium">Quantity</label>
              <input name="quantity" value={form.quantity} onChange={handleChange} required type="number" min="1" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium">Condition</label>
              <select name="condition" value={form.condition} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select</option>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="worn">Worn</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Your Name</label>
              <input name="donorName" value={form.donorName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input name="donorEmail" value={form.donorEmail} onChange={handleChange} required type="email" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input name="donorPhone" value={form.donorPhone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-medium">Address</label>
              <textarea name="donorAddress" value={form.donorAddress} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Donate</button>
          </form>
        </>
      )}
    </div>
  );
}
