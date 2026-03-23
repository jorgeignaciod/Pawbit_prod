import { HealthRecord } from "@/types/health-record";

import { HealthRecordItem } from "@/components/health/health-record-item";

export function TimelineList({ records }: { records: HealthRecord[] }) {
  return (
    <div className="space-y-3">
      {records.map((record) => (
        <HealthRecordItem key={record.id} record={record} />
      ))}
    </div>
  );
}
