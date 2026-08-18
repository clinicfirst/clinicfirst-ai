import { showToast } from '../../components/common/Toast';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  PhoneCall,
  Bot,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  Phone,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { apiRequest } from '../../api';
import { Appointment, Escalation, Doctor, WeeklyAnalytics } from '../../types';
import { ClinicWeeklyAnalytics } from '../../components/clinic/ClinicWeeklyAnalytics';

interface ClinicDashboardProps {
  onNavigateToTab: (tab: any) => void;
  onOpenPhoneSimulator: () => void;
}

export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({
  onNavigateToTab,
  onOpenPhoneSimulator,
}) => {
  const [data, setData] = useState<{
    clinic: any;
    date: string;
    metrics: {
      todayAppointmentsTotal: number;
      todayConfirmed: number;
      todayCompleted: number;
      todayRescheduled: number;
      todayCancelled: number;
      todayAiCalls: number;
      todayAiBookedCount: number;
      activeDoctorsCount: number;
      pendingEscalationsCount: number;
    };
    upcomingToday: Appointment[];
    pendingEscalations: Escalation[];
    aiStatus: {
      name: string;
      status: string;
      provider: string;
    };
    activeDoctors: Doctor[];
    weeklyAnalytics?: WeeklyAnalytics;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/clinic/dashboard');
      setData(res);
    } catch (err) {
      console.error('Failed to load clinic dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleResolveEscalation = async (escalationId: string) => {
    try {
      setResolvingId(escalationId);
      await apiRequest(`/api/clinic/escalations/${escalationId}/resolve`, {
        method: 'PUT',
      });
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message || 'Failed to resolve escalation', 'error');
    } finally {
      setResolvingId(null);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await apiRequest(`/api/clinic/appointments/${appointmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message || 'Failed to update appointment', 'error');
    }
  };

  if (!data && loading) {
    return (
      <div className="py-20 text-center text-xs text-[#64748B] font-mono flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#E2E8F0] border-t-[#0F4C5C] animate-spin" />
        <span>Loading clinic operational intelligence...</span>
      </div>
    );
  }

  const m = data?.metrics || {
    todayAppointmentsTotal: 0,
    todayConfirmed: 0,
    todayCompleted: 0,
    todayRescheduled: 0,
    todayCancelled: 0,
    todayAiCalls: 0,
    todayAiBookedCount: 0,
    activeDoctorsCount: 0,
    pendingEscalationsCount: 0,
  };

  const currencySymbol = data?.clinic?.currency_symbol || '$';

  return (
    <div className="space-y-6 animate-fade-enter">
      {/* Clinic Daily Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A] tracking-tight">Today's Clinic Operations</h1>
            <span className="text-xs px-2.5 py-0.5 bg-[#E6F7F5] border border-[#2AAFA3]/30 rounded-md font-mono font-semibold text-[#0F4C5C]">
              {data?.date || new Date().toISOString().split('T')[0]}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time patient flow, on-duty clinical team, and automated AI receptionist activities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            onClick={fetchDashboard}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* 1. Today's Activity: 4 Premium Clinical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Appointments */}
        <div
          onClick={() => onNavigateToTab('appointments')}
          className="p-5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:shadow-md hover:border-[#0F4C5C]/40 transition-all duration-200 motion-safe:hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] group-hover:text-[#0F4C5C] transition-colors">
              Today's Appointments
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center group-hover:bg-[#0F4C5C] group-hover:text-white transition-all">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#172B3A] font-mono tracking-tight">
            {m.todayAppointmentsTotal}
          </div>
          <div className="text-xs text-[#64748B] mt-2 flex items-center gap-1.5 font-medium">
            <span className="text-teal-700 font-semibold">{m.todayConfirmed} Confirmed</span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-emerald-700 font-semibold">{m.todayCompleted} Completed</span>
          </div>
        </div>

        {/* AI Calls */}
        <div
          onClick={() => onNavigateToTab('calls')}
          className="p-5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:shadow-md hover:border-[#2AAFA3]/50 transition-all duration-200 motion-safe:hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] group-hover:text-[#2AAFA3] transition-colors">
              AI Handled Calls
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#2AAFA3]/15 text-[#0F4C5C] flex items-center justify-center group-hover:bg-[#2AAFA3] group-hover:text-white transition-all">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#172B3A] font-mono tracking-tight">
            {m.todayAiCalls}
          </div>
          <div className="text-xs text-[#0F4C5C] mt-2 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2AAFA3]" />
            <span>{m.todayAiBookedCount} Booked automatically</span>
          </div>
        </div>

        {/* Doctors Available */}
        <div
          onClick={() => onNavigateToTab('doctors')}
          className="p-5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:shadow-md hover:border-[#0284C7]/40 transition-all duration-200 motion-safe:hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] group-hover:text-[#0284C7] transition-colors">
              Doctors Available
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-all">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#172B3A] font-mono tracking-tight">
            {m.activeDoctorsCount}
          </div>
          <div className="text-xs text-[#64748B] mt-2 font-medium">Active clinical staff on duty</div>
        </div>

        {/* Pending Actions */}
        <div
          onClick={() => onNavigateToTab('calls')}
          className={`p-5 bg-white border rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 motion-safe:hover:-translate-y-0.5 group ${
            m.pendingEscalationsCount > 0
              ? 'border-rose-300 ring-1 ring-rose-300/50 bg-rose-50/10'
              : 'border-[#E2E8F0]'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] group-hover:text-rose-600 transition-colors">
              Pending Actions
            </span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                m.pendingEscalationsCount > 0
                  ? 'bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-[#0F4C5C] group-hover:text-white'
              }`}
            >
              {m.pendingEscalationsCount > 0 ? (
                <AlertCircle className="w-4 h-4 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#172B3A] font-mono tracking-tight">
            {m.pendingEscalationsCount}
          </div>
          <div
            className={`text-xs mt-2 font-semibold ${
              m.pendingEscalationsCount > 0 ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {m.pendingEscalationsCount > 0 ? 'Staff callback required' : 'All escalations clear'}
          </div>
        </div>
      </div>

      {/* 2. AI Receptionist Status (Clinical Accent Card) */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-white via-white to-[#2AAFA3]/10 border border-[#E2E8F0] border-l-4 border-l-[#2AAFA3] rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center shrink-0 shadow-sm relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#2AAFA3] border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#2AAFA3] border-2 border-white rounded-full" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#172B3A]">
                {data?.aiStatus.name || 'Ava (AI Receptionist)'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E6F7F5] text-[#0F4C5C] border border-[#2AAFA3]/40">
                <span className="w-2 h-2 rounded-full bg-[#2AAFA3] animate-pulse" />
                Live Receptionist
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-medium">
                Engine: {data?.aiStatus.provider === 'sarvam' ? 'Sarvam.ai' : 'Gemini Live'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Real-time conversational triage, doctor availability checking, slot booking, and secure medical emergency escalation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <Button
            variant="outline"
            size="sm"
            icon={<Phone className="w-3.5 h-3.5 text-[#0F4C5C]" />}
            onClick={onOpenPhoneSimulator}
          >
            Test Call
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('ai_receptionist')}
          >
            Configure
          </Button>
        </div>
      </div>

      {/* 3. Summary Practice Analytics & AI Receptionist Volume (Recharts) */}
      {data?.weeklyAnalytics && (
        <ClinicWeeklyAnalytics
          analytics={data.weeklyAnalytics}
          onNavigateToTab={onNavigateToTab}
        />
      )}

      {/* 4. Today's Appointments Queue */}
      <div className="space-y-4">
        <Card
          title="Today's Appointments Queue"
          subtitle="Patient queue and appointment status tracking"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToTab('appointments')}
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#0F4C5C]" />}
            >
              View Full Schedule
            </Button>
          }
        >
          {data?.upcomingToday.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-[#172B3A]">No appointments scheduled for today yet.</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">Inbound calls to the AI Receptionist will appear here immediately upon confirmation.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {data?.upcomingToday.map((apt) => {
                const patientName =
                  (apt as any).patient_name ||
                  apt.patient?.name ||
                  'Patient';
                const patientPhone =
                  (apt as any).patient_phone ||
                  apt.patient?.phone ||
                  '';
                const doctorName =
                  (apt as any).doctor_name ||
                  apt.doctor?.name ||
                  'Assigned Physician';
                const doctorSpec =
                  (apt as any).doctor_specialization ||
                  apt.doctor?.specialization ||
                  'General Practice';
                const serviceName =
                  (apt as any).service_name ||
                  apt.service?.name ||
                  'Consultation';
                const serviceFee =
                  (apt as any).service_fee !== undefined
                    ? (apt as any).service_fee
                    : apt.service?.fee !== undefined
                    ? apt.service.fee
                    : null;

                return (
                  <div
                    key={apt.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/80 px-3 rounded-lg transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Time Slot Box */}
                      <div className="text-center font-mono px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs shrink-0 group-hover:border-[#0F4C5C]/30 transition-colors">
                        <div className="font-bold text-[#0F4C5C] text-xs sm:text-sm">{apt.start_time}</div>
                        <div className="text-[10px] text-[#94A3B8] font-medium">{apt.end_time}</div>
                      </div>

                      <div className="min-w-0 space-y-1">
                        {/* Patient Line */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-[#172B3A]">
                            {patientName}
                          </span>
                          {patientPhone && (
                            <span className="text-[11px] font-mono text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md">
                              {patientPhone}
                            </span>
                          )}
                          <Badge status={apt.status} />
                          {apt.created_via === 'ai_receptionist' && (
                            <Badge status="AI_RECEPTIONIST" label="AI Booked" />
                          )}
                        </div>

                        {/* Doctor & Service Line */}
                        <div className="text-xs text-[#64748B] flex flex-wrap items-center gap-1.5">
                          <span className="text-[#94A3B8]">Doctor:</span>
                          <span className="font-semibold text-[#172B3A]">{doctorName}</span>
                          <span className="text-[#94A3B8] text-[11px]">({doctorSpec})</span>
                          <span className="text-[#CBD5E1]">•</span>
                          <span className="text-[#0F4C5C] font-semibold">{serviceName}</span>
                          {serviceFee !== null && (
                            <span className="text-[#64748B] font-mono text-[11px]">
                              ({currencySymbol}{serviceFee})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Operational Status Update */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {apt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'COMPLETED')}
                          className="px-3 py-1.5 text-xs bg-white border border-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white text-[#0F4C5C] font-semibold rounded-lg transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* 4. Pending Actions & Urgent Call Escalations */}
      <div className="space-y-3">
        {data?.pendingEscalations.length === 0 ? (
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2.5 text-[#172B3A]">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-semibold">
                No pending call escalations requiring staff callback. All inbound calls resolved.
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold px-2 py-0.5 bg-emerald-50 rounded-md shrink-0">
              Queue Clear
            </span>
          </div>
        ) : (
          <Card
            title="Urgent Call Escalations"
            subtitle="Patients requiring immediate clinic staff callback"
            headerClassName="bg-rose-50/50 border-rose-100"
          >
            <div className="space-y-3">
              {data?.pendingEscalations.map((esc) => (
                <div key={esc.id} className="p-4 bg-white border border-rose-200 rounded-xl text-xs space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span className="font-bold text-rose-700 font-mono">PRIORITY ESCALATION</span>
                    </div>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      {new Date(esc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-[#172B3A] font-semibold text-sm">{esc.reason}</div>

                  {esc.context_summary && (
                    <p className="text-xs text-[#64748B] bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {esc.context_summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-mono text-[#172B3A]">
                      Caller: <span className="font-bold">{esc.caller_phone || 'Direct Patient'}</span>
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      loading={resolvingId === esc.id}
                      onClick={() => handleResolveEscalation(esc.id)}
                    >
                      Mark Handled
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

