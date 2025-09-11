import React, { useMemo, useState } from 'react';

interface Props { onClassCreated: () => void; }
type JwtPayload = { userId?: number };

function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null;
  try { const [,p]=token.split('.'); const j:JwtPayload=JSON.parse(atob(p)); return Number(j.userId)||null; }
  catch { return null; }
}

const AdminClassForm: React.FC<Props> = ({ onClassCreated }) => {
  const [name,setName]=useState('');
  const [datetime,setDatetime]=useState('');
  const [capacity,setCapacity]=useState(10);
  const [description,setDescription]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(''); const [success,setSuccess]=useState('');

  const token = useMemo(()=>localStorage.getItem('token'),[]);
  const createdById = useMemo(()=>getUserIdFromToken(token),[token]);

  const nowLocalForInput = new Date(Date.now()+60_000).toISOString().slice(0,16);
  const isFuture = datetime ? new Date(datetime).getTime() > Date.now()+60_000 : false;
  const disabled = loading || !name.trim() || !isFuture || capacity<1 || !createdById;

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setError(''); setSuccess('');
    if(!createdById){ setLoading(false); setError('Token inválido.'); return; }
    try{
      const res = await fetch('http://localhost:3001/api/classes',{
        method:'POST',
        headers:{ 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) },
        body:JSON.stringify({ name, datetime, capacity, description, createdById })
      });
      const data = await res.json().catch(()=> ({}));
      if(!res.ok) throw new Error(data?.message || 'Error creating class');
      setName(''); setDatetime(''); setCapacity(10); setDescription('');
      setSuccess('Clase creada ✅'); onClassCreated();
    }catch(e:any){ setError(e?.message || 'Network error'); }
    finally{ setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="full">
          <label className="helper">Nombre de la clase</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Yoga Flow" required/>
        </div>
        <div>
          <label className="helper">Fecha y hora</label>
          <input className="input" type="datetime-local" value={datetime} min={nowLocalForInput}
                 onChange={e=>setDatetime(e.target.value)} required/>
        </div>
        <div>
          <label className="helper">Cupo</label>
          <input className="input" type="number" min={1} value={capacity}
                 onChange={e=>setCapacity(Number(e.target.value))} required/>
        </div>
        <div className="full">
          <label className="helper">Descripción (opcional)</label>
          <textarea className="textarea" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <button className="btn btn-primary" type="submit" disabled={disabled}>
          {loading ? 'Creando…' : 'Crear clase'}
        </button>
        {error && <div className="auth-error">{error}</div>}
        {success && <div style={{color:'var(--success)'}}>{success}</div>}
      </div>
    </form>
  );
};

export default AdminClassForm;
