import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/auth-context";
import { API_URL } from "../api";
import Layout from "../components/layout/layout";

interface ReservationRequest {
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
}
interface RecurringRequest {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  minCapacity: number;
  softwareIds: string[];
  equipmentIds: string[];
  frequency: string;
  interval: number;
  byDays: string[];
}
interface Proposal {
  id: string;
  teacherEmail: string;
  studentEmail: string;
  originalReservationId: string;
  originalRecurrenceId: string | null;
  reservationRequests: ReservationRequest[];
  recurringRequests: RecurringRequest[];
  status: "PENDING";
  comment: string;
}
interface Software {
  id: string;
  name: string;
}
interface Equipment {
  id: string;
  name: string;
}

const dayMap: Record<string, string> = {
  MONDAY: "Poniedziałek",
  TUESDAY: "Wtorek",
  WEDNESDAY: "Środa",
  THURSDAY: "Czwartek",
  FRIDAY: "Piątek",
  SATURDAY: "Sobota",
  SUNDAY: "Niedziela",
};

const freqMap: Record<string, string> = {
  DAILY: "dzień",
  WEEKLY: "tydzień",
  MONTHLY: "miesiąc",
};

const ProposalListPage: React.FC = () => {
  const { user, token } = useAuth();
  if (!user) return null;

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [softwareList, setSoftwareList] = useState<Software[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [swRes, eqRes, propRes] = await Promise.all([
        fetch(`${API_URL}/software`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/equipment`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/proposals/student`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!swRes.ok) throw new Error("Błąd ładowania oprogramowania");
      if (!eqRes.ok) throw new Error("Błąd ładowania sprzętu");
      if (!propRes.ok) throw new Error("Błąd ładowania propozycji");
      const [swData, eqData, propData] = await Promise.all([
        swRes.json(),
        eqRes.json(),
        propRes.json(),
      ]);
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

  const softwareMap = Object.fromEntries(
    softwareList.map((s) => [s.id, s.name])
  );
  const equipmentMap = Object.fromEntries(
    equipmentList.map((e) => [e.id, e.name])
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">Ładowanie...</div>
    );
  if (error) return <div className="text-error">Błąd: {error}</div>;

  const getPurpose = (p: Proposal) =>
    p.reservationRequests[0]?.purpose || p.recurringRequests[0]?.purpose || "";

  const handleConfirm = async () => {
    if (!selectedProposal || chosenIndex === null) return;
    try {
      const res = await fetch(
        `${API_URL}/proposals/${selectedProposal.id}/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chosenIndex }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Błąd potwierdzania");
      }
      setProposals((prev) => prev.filter((p) => p.id !== selectedProposal.id));
      setSelectedProposal(null);
      setChosenIndex(null);
    } catch (e: any) {
      alert(`Nie udało się potwierdzić: ${e.message}`);
    }
  };

  const handleReject = async () => {
    if (!selectedProposal) return;
    if (!window.confirm("Na pewno odrzucić propozycję?")) return;
    try {
      const res = await fetch(
        `${API_URL}/proposals/${selectedProposal.id}/reject`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Błąd odrzucania");
      }
      setProposals((prev) => prev.filter((p) => p.id !== selectedProposal.id));
      setSelectedProposal(null);
      setChosenIndex(null);
    } catch (e: any) {
      alert(`Nie udało się odrzucić: ${e.message}`);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-16">
        <h1 className="text-2xl font-bold mb-4 justify-center text-center">
          Twoje oczekujące propozycje
        </h1>
        {proposals.length === 0 ? (
          <div className="text-center py-10 text-lg">
            Nie masz żadnych nowych propozycji
          </div>
        ) : (
          <table className="table bg-base-200 w-full">
            <thead>
              <tr>
                <th>Od</th>
                <th>Cel</th>
                <th>Status</th>
                <th>Szczegóły</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => {
                const isSelected = selectedProposal?.id === p.id;
                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover">
                      <td>{p.teacherEmail}</td>
                      <td>{getPurpose(p)}</td>
                      <td>
                        <span className="badge badge-warning">Oczekuje</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            setSelectedProposal(isSelected ? null : p)
                          }
                        >
                          {isSelected ? "Zwiń" : "Otwórz szczegóły"}
                        </button>
                      </td>
                    </tr>
                    {isSelected && (
                      <tr>
                        <td colSpan={4}>
                          <div className="p-4 bg-base-100 rounded-lg space-y-2">
                            <p>
                              <strong>Od:</strong> {p.teacherEmail}
                            </p>
                            <p>
                              <strong>Dla:</strong> {p.studentEmail}
                            </p>
                            {p.comment && (
                              <p>
                                <strong>Komentarz:</strong> {p.comment}
                              </p>
                            )}
                            <p>
                              <strong>Min. miejsc:</strong>{" "}
                              {p.reservationRequests[0]?.minCapacity ||
                                p.recurringRequests[0]?.minCapacity}
                            </p>
                            <p>
                              <strong>Oprogramowanie:</strong>{" "}
                              {(
                                p.reservationRequests[0]?.softwareIds ||
                                p.recurringRequests[0]?.softwareIds
                              )
                                .map((id) => softwareMap[id] || id)
                                .join(", ")}
                            </p>
                            <p>
                              <strong>Sprzęt:</strong>{" "}
                              {(
                                p.reservationRequests[0]?.equipmentIds ||
                                p.recurringRequests[0]?.equipmentIds
                              )
                                .map((id) => equipmentMap[id] || id)
                                .join(", ")}
                            </p>

                            <div className="space-y-2">
                              {[
                                ...p.reservationRequests.map((r, i) => ({
                                  type: "single",
                                  data: r,
                                  index: i,
                                })),
                                ...p.recurringRequests.map((r, i) => ({
                                  type: "recurring",
                                  data: r,
                                  index: p.reservationRequests.length + i,
                                })),
                              ].map((slot) => (
                                <div
                                  key={slot.index}
                                  className="border rounded p-3 flex items-start space-x-3"
                                >
                                  <input
                                    type="radio"
                                    name={`chosenSlot-${p.id}`}
                                    checked={chosenIndex === slot.index}
                                    onChange={() => {
                                      setSelectedProposal(p);
                                      setChosenIndex(slot.index);
                                    }}
                                    className="mt-1"
                                  />
                                  <div>
                                    {slot.type === "single" ? (
                                      <p>
                                        <strong>
                                          {
                                            (slot.data as ReservationRequest)
                                              .date
                                          }{" "}
                                          {
                                            (slot.data as ReservationRequest)
                                              .startTime
                                          }
                                          –
                                          {
                                            (slot.data as ReservationRequest)
                                              .endTime
                                          }
                                        </strong>
                                      </p>
                                    ) : (
                                      <>
                                        <p>
                                          <strong>
                                            {
                                              (slot.data as RecurringRequest)
                                                .startDate
                                            }{" "}
                                            do{" "}
                                            {
                                              (slot.data as RecurringRequest)
                                                .endDate
                                            }{" "}
                                            {
                                              (slot.data as RecurringRequest)
                                                .startTime
                                            }
                                            –
                                            {
                                              (slot.data as RecurringRequest)
                                                .endTime
                                            }
                                          </strong>
                                        </p>
                                        <p>
                                          Częstotliwość: co{" "}
                                          {
                                            (slot.data as RecurringRequest)
                                              .interval
                                          }{" "}
                                          {freqMap[
                                            (slot.data as RecurringRequest)
                                              .frequency
                                          ].toLowerCase()}
                                        </p>
                                        <p>
                                          Dni:{" "}
                                          {(
                                            slot.data as RecurringRequest
                                          ).byDays
                                            .map((d) => dayMap[d] || d)
                                            .join(", ")}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                className="btn btn-success"
                                onClick={handleConfirm}
                                disabled={chosenIndex === null}
                              >
                                Potwierdź
                              </button>
                              <button
                                className="btn btn-error"
                                onClick={handleReject}
                              >
                                Odrzuć
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default ProposalListPage;
