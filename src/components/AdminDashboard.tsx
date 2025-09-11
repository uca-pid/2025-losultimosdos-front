import React, { useEffect, useMemo, useState } from 'react';
import AdminClassForm from './AdminClassForm';

type ClassRow = {
  id: number;
  name: string;
  datetime: string; // ISO
  capacity: number;
  booked: number;
  description?: string;
};

function getToken(){ return localStorage.getItem('token'); }

const AdminDashboard: React.FC = () => {
  const token = useMemo(getToken, []);
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [includePast, setIncludePast] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load(){
      if(!token){ setError('Sesión inválida. Volvé a iniciar sesión.'); return; }
      setLoading(true); setError('');
      try{
        const url = `http://localhost:3001/api/admin/classes${includePast ? '?includePast=true' : ''}`;
        const res = await fetch(url, { headers:{ Authorization:`Bearer ${token}` } });
        const data = await res.json().catch(()=>[]);
        if(!res.ok){ throw new Error((data as any)?.message || 'Error fetching classes'); }
        if(!cancelled) setRows(data as ClassRow[]);
      }catch(e:any){
        if(!cancelled) setError(e?.message || 'Network error');
      }finally{ if(!cancelled) setLoading(false); }
    }
    load();
    return ()=>{ cancelled = true; };
  }, [includePast, token, refreshKey]);

  const onCreated = ()=>{ setShowForm(false); setRefreshKey(k=>k+1); };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Mis clases</div>
        <div className="toolbar">
          <div />
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-ghost" onClick={()=>setIncludePast(v=>!v)}>
              {includePast ? 'Ocultar pasadas' : 'Incluir pasadas'}
            </button>
            <button className="btn" onClick={()=>setRefreshKey(k=>k+1)} disabled={loading}>
              {loading ? 'Actualizando…' : 'Refrescar'}
            </button>
            <button className="btn btn-primary" onClick={()=>setShowForm(v=>!v)}>
              {showForm ? 'Cerrar formulario' : '+ Crear clase'}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card-body">
          <AdminClassForm onClassCreated={onCreated}/>
        </div>
      )}

      <div className="card-body">
        {error && <div className="auth-error" style={{marginBottom:12}}>{error}</div>}
        {loading ? (
          <div>Cargando…</div>
        ) : rows.length === 0 ? (
          <div style={{opacity:.8}}>No tenés clases {includePast ? '' : 'próximas'} aún.</div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Clase</th>
                  <th>Fecha y hora</th>
                  <th>Ocupación</th>
                  <th style={{width:220}}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(c=>{
                  const starts = new Date(c.datetime);
                  const remaining = c.capacity - c.booked;
                  const pct = c.capacity>0 ? Math.round((c.booked/c.capacity)*100) : 0;
                  const isFull = remaining<=0;
                  const isPast = starts.getTime() <= Date.now();
                  const barColor = isFull ? 'var(--danger)' : (pct>=70 ? 'var(--warning)' : 'var(--success)');
                  const state =
                    isPast ? <span className="badge neutral">Finalizada</span> :
                    isFull ? <span className="badge danger">Completa</span> :
                    <span className="badge ok">Disponible</span>;

                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{fontWeight:700}}>{c.name}</div>
                        {c.description && <div className="helper">{c.description}</div>}
                      </td>
                      <td>{starts.toLocaleString()}</td>
                      <td style={{minWidth:220}}>
                        <div className="badges" style={{justifyContent:'space-between', marginBottom:6}}>
                          <span>{c.booked}/{c.capacity}</span>
                          <span className="helper">{pct}%</span>
                        </div>
                        <div className="progress"><span style={{width:`${Math.min(pct,100)}%`, background:barColor}}/></div>
                      </td>
                      <td>{state}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
