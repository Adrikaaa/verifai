type ScanResult = {
  id: string;
  label: string;
  confidence: number;
  createdAt: Date;
};

const scans = new Map<string, ScanResult>();

export function saveScan(scan: ScanResult) {
  scans.set(scan.id, scan);
}

export function getScan(id: string) {
  return scans.get(id);
}
