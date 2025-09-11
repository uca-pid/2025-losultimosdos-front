import React, { useEffect, useMemo, useState } from 'react';

interface ClassItem {
  id: number;
  name: string;
  datetime: string;
  capacity: number;
  booked: number;
}
interface MyReservation {
  id: number;       // reservation id
  classId: number;
  name: string;
  datetime: string;
}
interface Props { userId: number; }

function getToken() { return localStorage.getItem('token'); }

const ClassList: React.FC<Props> = ({ userId }) => {
  const token = useMemo(getToken, []);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [myRes, setMyRes] = useState<MyReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRes, setLoadingRes] = useState(false);
  const [error, setError] = useState('');
  const [resError, setResError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // fuerza recarga

  const reservedSet = useMemo(() => new Set(myRes.map(r => r.classId)), [myRes]);
  const refresh = () => setRefreshKey(k => k + 1);

  // Carga ambas listas sin depender de funciones externas
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Clases
      setLoading(true); setError('');
      try {
        const res = await fetch('http://localhost:3001/api/classes');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load classes');
        if (!cancelled) setClasses(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error loading classes');
      } finally {
        if (!cancelled) setLoading(false);
      }

      // Mis reservas
      if (!token) {
        if (!cancelled) { setResError('Sesión inválida. Volvé a iniciar sesión.'); setMyRes([]); }
        return;
      }
      setLoadingRes(true); setResError('');
      try {
        const res = await fetch('http://localhost:3001/api/my/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load reservations');
        if (!cancelled) setMyRes(data);
      } catch (e: any) {
        if (!cancelled) setResError(e?.message || 'Error loading reservations');
      } finally {
        if (!cancelled) setLoadingRes(false);
      }
    })();

    return () => { cancelled = true; };
  }, [token, refreshKey]);

  const handleBook = async (classId: number) => {
    setError(''); setSuccess('');
    if (reservedSet.has(classId)) return; // ya reservada
    try {
      const res = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, class_id: classId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Reserva confirmada ✅');
        refresh();
      } else {
        if (String(data?.message || '').toLowerCase().includes('already booked')) {
          refresh(); // refleja estado "Reservada"
        }
        setError(data.message || 'Booking failed');
      }
    } catch {
      setError('Network error');
    }
  };

  const cancelReservation = async (reservationId: number) => {
    setResError(''); setSuccess('');
    if (!token) { setResError('Sesión inválida. Volvé a iniciar sesión.'); return; }
    try {
      const res = await fetch(`http://localhost:3001/api/bookings/${reservationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to cancel');
      setSuccess('Reserva cancelada ✅');
      refresh();
    } catch (e: any) {
      setResError(e?.message || 'Network error');
    }
  };

  return (
    <>
      {/* Clases disponibles */}
      <div className="card">
        <div className="card-header"><div className="card-title">Clases disponibles</div></div>
        <div className="card-body">
          {loading ? (
            <div>Cargando…</div>
          ) : error ? (
            <div className="auth-error">{error}</div>
          ) : classes.length === 0 ? (
            <div style={{ opacity: .8 }}>No hay clases próximas.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
              {classes.map(cls => {
                const dt = new Date(cls.datetime);
                const remaining = cls.capacity - cls.booked;
                const pct = cls.capacity > 0 ? Math.round((cls.booked / cls.capacity) * 100) : 0;
                const isFull = remaining <= 0;
                const isReserved = reservedSet.has(cls.id);
                const barColor = isFull ? 'var(--danger)' : (pct >= 70 ? 'var(--warning)' : 'var(--success)');
                return (
                  <div key={cls.id} className="card">
                    <div className="card-body">
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{cls.name}</div>
                      <div className="helper">{dt.toLocaleString()}</div>
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span>{cls.booked}/{cls.capacity}</span>
                          <span className="helper">{pct}%</span>
                        </div>
                        <div className="progress"><span style={{ width: `${pct}%`, background: barColor }} /></div>
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: 10, width: '100%', opacity: isReserved ? 0.8 : 1 }}
                        disabled={isFull || isReserved}
                        onClick={() => handleBook(cls.id)}
                      >
                        {isReserved ? 'Reservada' : (isFull ? 'Clase completa' : 'Reservar')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {success && <div style={{ color: 'var(--success)', marginTop: 12 }}>{success}</div>}
        </div>
      </div>

      {/* Mis reservas */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><div className="card-title">Mis reservas</div></div>
        <div className="card-body">
          {loadingRes ? (
            <div>Cargando…</div>
          ) : resError ? (
            <div className="auth-error">{resError}</div>
          ) : myRes.length === 0 ? (
            <div style={{ opacity: .8 }}>No tenés reservas activas.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Clase</th>
                    <th>Fecha y hora</th>
                    <th style={{ width: 160 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {myRes.map(r => {
                    const dt = new Date(r.datetime);
                    const isPast = dt.getTime() <= Date.now();
                    return (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.name}</td>
                        <td>{dt.toLocaleString()}</td>
                        <td>
                          <button className="btn" disabled={isPast} onClick={() => cancelReservation(r.id)}>
                            {isPast ? 'Finalizada' : 'Cancelar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClassList;
