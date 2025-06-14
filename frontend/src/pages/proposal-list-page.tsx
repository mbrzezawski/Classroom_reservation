import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/auth-context';
import { API_URL } from '../api';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';


interface ReservationRequest { userId: string; date: string; startTime: string; endTime: string; purpose: string; minCapacity: number; softwareIds: string[]; equipmentIds: string[]; }
interface RecurringRequest { startDate: string; endDate: string; startTime: string; endTime: string; purpose: string; minCapacity: number; softwareIds: string[]; equipmentIds: string[]; frequency: string; interval: number; byDays: string[]; }
interface Proposal { id: string; teacherEmail: string; studentEmail: string; originalReservationId: string; originalRecurrenceId: string | null; reservationRequests: ReservationRequest[]; recurringRequests: RecurringRequest[]; status: 'PENDING'; comment: string; }
interface Software { id: string; name: string; }
interface Equipment { id: string; name: string; }

const dayMap: Record<string, string> = {
  MONDAY: 'Poniedziałek',
  TUESDAY: 'Wtorek',
  WEDNESDAY: 'Środa',
  THURSDAY: 'Czwartek',
  FRIDAY: 'Piątek',
  SATURDAY: 'Sobota',
  SUNDAY: 'Niedziela',
};

const freqMap: Record<string, string> = {
  DAILY: 'dzień',
  WEEKLY: 'tydzień',
  MONTHLY: 'miesiąc',
};

const ProposalListPage: React.FC = () => {
  const { user, token } = useAuth();
  if (!user) return null;

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [swRes, eqRes, propRes] = await Promise.all([
        fetch(`${API_URL}/software`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/equipment`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/proposals/student`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!swRes.ok) throw new Error('Błąd ładowania oprogramowania');
      if (!eqRes.ok) throw new Error('Błąd ładowania sprzętu');
      if (!propRes.ok) throw new Error('Błąd ładowania propozycji');
      const [swData, eqData, propData] = await Promise.all([swRes.json(), eqRes.json(), propRes.json()]);
      setSoftwareList(swData);
      setEquipmentList(eqData);
      setProposals(propData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const softwareMap = Object.fromEntries(softwareList.map(s => [s.id, s.name]));
  const equipmentMap = Object.fromEntries(equipmentList.map(e => [e.id, e.name]));

  if (loading) return <div className="flex justify-center items-center py-10">Ładowanie...</div>;
  if (error) return <div className="text-error">Błąd: {error}</div>;

  const getPurpose = (p: Proposal) => p.reservationRequests[0]?.purpose || p.recurringRequests[0]?.purpose || '';

  const handleConfirm = async () => {
    if (!selectedProposal || chosenIndex === null) return;
    try {
      const res = await fetch(
        `${API_URL}/proposals/${selectedProposal.id}/confirm`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ chosenIndex }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Błąd potwierdzania');
      }
      setProposals(prev => prev.filter(p => p.id !== selectedProposal.id));
      setSelectedProposal(null);
      setChosenIndex(null);
    } catch (e: any) {
      alert(`Nie udało się potwierdzić: ${e.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedProposal) return;
    if (!window.confirm('Na pewno odrzucić propozycję?')) return;
    try {
      const res = await fetch(
        `${API_URL}/proposals/${selectedProposal.id}/reject`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Błąd odrzucania');
      }
      setProposals(prev => prev.filter(p => p.id !== selectedProposal.id));
      setSelectedProposal(null);
      setChosenIndex(null);
    } catch (e: any) {
      alert(`Nie udało się odrzucić: ${e.message}`);
    }
  };

  return (
    <>
      <nav className="bg-base-200 p-4 mb-4">
        <Link to="/main" className="flex items-center text-lg font-semibold text-primary">
          <Home className="mr-2" />
        </Link>
      </nav>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Twoje oczekujące propozycje</h1>
      {proposals.length === 0 ? (
        <div className="text-center py-10 text-lg">Nie masz żadnych nowych propozycji</div>
      ) : (
        <>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Od</th>
                <th>Cel</th>
                <th>Status</th>
                <th>Szczegóły</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map(p => (
                <tr key={p.id} className="hover">
                  <td>{p.teacherEmail}</td>
                  <td>{getPurpose(p)}</td>
                  <td><span className="badge badge-warning">Oczekuje</span></td>
                  <td><button className="btn btn-sm btn-primary" onClick={() => setSelectedProposal(p)}>Otwórz szczegóły</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedProposal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-base-100 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative max-h-[90vh] overflow-y-auto">
                <button className="btn btn-sm btn-circle btn-ghost absolute top-4 right-4" onClick={() => { setSelectedProposal(null); setChosenIndex(null); }}>✕</button>
                <h2 className="text-xl font-bold mb-2">Szczegóły propozycji</h2>
                <div className="space-y-2 mb-4">
                  <p><strong>Od:</strong> {selectedProposal.teacherEmail}</p>
                  <p><strong>Dla:</strong> {selectedProposal.studentEmail}</p>
                  {selectedProposal.comment && <p><strong>Komentarz:</strong> {selectedProposal.comment}</p>}
                  <p><strong>Min. miejsc:</strong> {selectedProposal.reservationRequests[0]?.minCapacity || selectedProposal.recurringRequests[0]?.minCapacity}</p>
                  <p><strong>Oprogramowanie:</strong> {(selectedProposal.reservationRequests[0]?.softwareIds || selectedProposal.recurringRequests[0]?.softwareIds).map(id => softwareMap[id] || id).join(', ')}</p>
                  <p><strong>Sprzęt:</strong> {(selectedProposal.reservationRequests[0]?.equipmentIds || selectedProposal.recurringRequests[0]?.equipmentIds).map(id => equipmentMap[id] || id).join(', ')}</p>
                </div>

                <form>
                  <h3 className="font-semibold mt-4 mb-2">Wybierz termin:</h3>
                  <div className="space-y-4">
                    {[
                      ...selectedProposal.reservationRequests.map((r, i) => ({ type: 'single', data: r, index: i })),
                      ...selectedProposal.recurringRequests.map((r, i) => ({ type: 'recurring', data: r, index: selectedProposal.reservationRequests.length + i })),
                    ].map(slot => (
                      <div key={slot.index} className="border rounded p-3 flex items-start space-x-3">
                        <input type="radio" name="chosenSlot" checked={chosenIndex === slot.index} onChange={() => setChosenIndex(slot.index)} className="mt-1" />
                        <div>
                          {slot.type === 'single' ? (
                            <p><strong>{(slot.data as ReservationRequest).date} {(slot.data as ReservationRequest).startTime}–{(slot.data as ReservationRequest).endTime}</strong></p>
                          ) : (
                            <>
                              <p><strong>{(slot.data as RecurringRequest).startDate} do {(slot.data as RecurringRequest).endDate} {(slot.data as RecurringRequest).startTime}–{(slot.data as RecurringRequest).endTime}</strong></p>
                              <p>Częstotliwość: co {(slot.data as RecurringRequest).interval} {freqMap[(slot.data as RecurringRequest).frequency].toLowerCase()}</p>
                              <p>Dni: {(slot.data as RecurringRequest).byDays.map(d => dayMap[d] || d).join(', ')}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </form>

                <div className="flex justify-end mt-6 space-x-3">
                  <button className="btn btn-success" onClick={handleConfirm} disabled={chosenIndex === null}>Potwierdź</button>
                  <button className="btn btn-error" onClick={handleReject}>Odrzuć</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
};

export default ProposalListPage;
