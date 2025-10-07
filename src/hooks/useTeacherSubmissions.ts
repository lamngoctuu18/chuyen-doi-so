import { useEffect, useState } from 'react';
import { createSubmissionSlot, listTeacherSlots, getSlotStatuses, commentSubmission } from '../services/teacherSubmissionsAPI';

export function useTeacherSlots() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = async () => {
    try {
      setLoading(true);
      const data = await listTeacherSlots();
      setSlots(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Lỗi tải đợt nộp');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { refresh(); }, []);
  return { slots, loading, error, refresh };
}

export function useSlotStatuses(slotId?: number) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = async (id = slotId) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getSlotStatuses(id);
      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Lỗi tải trạng thái');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { if (slotId) load(slotId); }, [slotId]);
  return { data, loading, error, load };
}

export async function createSlot(input: { tieu_de: string; loai_bao_cao?: 'tuan'|'thang'|'cuoi_ky'|'tong_ket'; mo_ta?: string; start_at: string; end_at: string; }) {
  return createSubmissionSlot(input);
}

export async function addComment(submissionId: number, comment: string, trang_thai?: 'da_nop'|'da_duyet'|'tu_choi') {
  return commentSubmission(submissionId, { comment, trang_thai });
}
