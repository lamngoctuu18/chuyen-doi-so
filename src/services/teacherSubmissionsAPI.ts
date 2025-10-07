const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {} as Record<string, string>;
};

export interface SubmissionSlotInput {
  tieu_de: string;
  loai_bao_cao?: 'tuan'|'thang'|'cuoi_ky'|'tong_ket';
  mo_ta?: string;
  start_at: string; // ISO datetime
  end_at: string;   // ISO datetime
}

export async function createSubmissionSlot(payload: SubmissionSlotInput) {
  const res = await fetch(`${API_URL}/teacher-submissions/slots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create slot');
  return res.json();
}

export async function listTeacherSlots() {
  const res = await fetch(`${API_URL}/teacher-submissions/slots`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to list slots');
  return res.json();
}

export async function getSlotStatuses(slotId: number) {
  const res = await fetch(`${API_URL}/teacher-submissions/slots/${slotId}/statuses`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to get slot statuses');
  return res.json();
}

export async function commentSubmission(submissionId: number, data: { comment: string; trang_thai?: 'da_nop'|'da_duyet'|'tu_choi' }) {
  const res = await fetch(`${API_URL}/teacher-submissions/submissions/${submissionId}/comment`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to comment');
  return res.json();
}

export async function updateSlotTimes(slotId: number, data: { start_at: string; end_at: string }) {
  const res = await fetch(`${API_URL}/teacher-submissions/slots/${slotId}/times`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update slot times');
  return res.json();
}

export async function listOpenSlotsForStudent() {
  const res = await fetch(`${API_URL}/teacher-submissions/student/open-slots`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to list open slots');
  return res.json();
}

export async function listAllSlotsForStudent() {
  const res = await fetch(`${API_URL}/teacher-submissions/student/all-slots`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to list all slots');
  return res.json();
}

export async function uploadStudentSubmission(slotId: number, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/teacher-submissions/student/slots/${slotId}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: form
  } as any);
  if (!res.ok) throw new Error('Failed to upload submission');
  return res.json();
}

export async function uploadMultipleStudentSubmissions(slotId: number, files: File[]) {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  const res = await fetch(`${API_URL}/teacher-submissions/student/slots/${slotId}/uploads`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: form
  } as any);
  if (!res.ok) throw new Error('Failed to upload submissions');
  return res.json();
}

export async function getAdvisorInfo() {
  const res = await fetch(`${API_URL}/teacher-submissions/student/advisor`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to get advisor info');
  return res.json();
}

export async function listMySubmissions(slotId: number) {
  const res = await fetch(`${API_URL}/teacher-submissions/student/slots/${slotId}/my-submissions`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to get my submissions');
  return res.json();
}
