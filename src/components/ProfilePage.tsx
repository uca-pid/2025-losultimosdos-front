import React, { useEffect, useMemo, useState } from 'react';

type Role = 'admin' | 'user';
type UserMe = { id:number; email:string; fullName:string; role:Role; };
interface Props { onLogout: () => void; }

function getToken(){ return localStorage.getItem('token'); }

const ProfilePage: React.FC<Props> = ({ onLogout }) => {
  const token = useMemo(getToken, []);
  const [me,setMe]=useState<UserMe|null>(null);
  const [fullName,setFullName]=useState(''); const [email,setEmail]=useState('');
  const [currentPassword,setCurrentPassword]=useState(''); const [newPassword,setNewPassword]=useState(''); const [confirmNew,setConfirmNew]=useState('');
  const [loading,setLoading]=useState(false); const [saving,setSaving]=useState(false);
  const [error,setError]=useState(''); const [success,setSuccess]=useState('');

  useEffect(()=>{
    let c=false;
    (async()=>{
      if(!token){ setError('Sesión inválida.'); return; }
      setLoading(true);
      try{
        const res=await fetch('http://localhost:3001/api/me',{ headers:{Authorization:`Bearer ${token}`}});
        const data=await res.json();
        if(!res.ok) throw new Error(data?.message || 'Error loading profile');
        if(!c){ setMe(data); setFullName(data.fullName); setEmail(data.email); }
      }catch(e:any){ if(!c) setError(e?.message || 'Network error'); }
      finally{ if(!c) setLoading(false); }
    })();
    return ()=>{ c=true; };
  },[token]);

  const handleSave=async(e:React.FormEvent)=>{
    e.preventDefault(); setError(''); setSuccess('');
    if(!token){ setError('Sesión inválida.'); return; }
    if(newPassword && newPassword!==confirmNew){ setError('La confirmación no coincide'); return; }
    setSaving(true);
    try{
      const body:any={ fullName, email };
      if(newPassword){ body.currentPassword=currentPassword; body.newPassword=newPassword; }
      const res=await fetch('http://localhost:3001/api/me',{
        method:'PATCH', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify(body)
      });
      const data=await res.json();
      if(!res.ok) throw new Error(data?.message || 'Error updating profile');
      setSuccess('Perfil actualizado ✅'); setCurrentPassword(''); setNewPassword(''); setConfirmNew('');
      if(data?.user){ setMe(data.user); setFullName(data.user.fullName); setEmail(data.user.email); }
    }catch(e:any){ setError(e?.message || 'Network error'); }
    finally{ setSaving(false); }
  };

  return (
    <div className="card">
      <div className="card-header"><div className="card-title">Mi perfil</div></div>
      <div className="card-body">
        {loading ? <div>Cargando…</div> :
        error ? <div className="auth-error">{error}</div> :
        <form onSubmit={handleSave}>
          
          <div className="form-grid">
            <div>
              <label className="helper">Nombre completo</label>
              <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} required/>
            </div>
            <div>
              <label className="helper">Email</label>
              <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
            </div>

            <div className="full" style={{marginTop:8, fontWeight:600, opacity:.9}}>Cambiar contraseña (opcional)</div>
            <div>
              <label className="helper">Contraseña actual</label>
              <input className="input" type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/>
            </div>
            <div>
              <label className="helper">Nueva contraseña (mín. 6)</label>
              <input className="input" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
            </div>
            <div className="col">
              <label className="helper">Confirmar nueva contraseña</label>
              <input className="input" type="password" value={confirmNew} onChange={e=>setConfirmNew(e.target.value)}/>
            </div>
          </div>

          <div style={{display:'flex', gap:8, marginTop:14}}>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
            <button type="button" className="btn" onClick={onLogout}>Cerrar sesión</button>
          </div>

          {success && <div style={{color:'var(--success)', marginTop:12}}>{success}</div>}
        </form>}
      </div>
    </div>
  );
};

export default ProfilePage;
