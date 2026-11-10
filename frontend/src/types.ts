export interface SystemStatus {
  status: string;
  version: string;
  hardware: {
    cuda_available: boolean;
    device_name: string;
    can_remove_visible: boolean;
    can_remove_metadata: boolean;
    can_remove_invisible: boolean;
  };
  supported_signals: string[];
}

export interface ProvenanceReport {
  is_ai_generated: boolean;
  confidence: string;
  platform: string;
  watermarks: string[];
  signals: Record<string, any>;
  c2pa: string;
  caveats: string[];
  has_ai_metadata?: boolean;
  file_url?: string;
  filename?: string;
  file_size_bytes?: number;
}

export interface CleanResponse {
  success: boolean;
  mode: string;
  elapsed_seconds: number;
  original_url: string;
  cleaned_url: string;
  filename: string;
  original_size: number;
  cleaned_size: number;
  removed_marks: string[];
  pre_inspection: ProvenanceReport;
  post_inspection: ProvenanceReport;
}

export interface BatchItem {
  filename: string;
  success: boolean;
  original_url?: string;
  cleaned_url?: string;
  removed_marks?: string[];
  ai_detected_after?: boolean;
  error?: string;
}

export interface BatchResponse {
  batch_id: string;
  total_files: number;
  results: BatchItem[];
  zip_url: string;
}
