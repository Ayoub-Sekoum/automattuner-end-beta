export enum AppStatus {
  IDLE = 'IDLE',
  PACKAGING = 'PACKAGING',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface IntuneApp {
  id: string;
  name: string;
  version: string;
  status: AppStatus;
  progress: number;
  lastUpdated: string;
  size: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface AutoMatConfig {
  intune_tenant_id: string;
  intune_client_id: string;
  intune_client_secret: string;
  powershell_cert_thumbprint: string;
  default_logo_path: string;
  temp_package_dir: string;
  wintuner_download_dir: string;
  required_permissions: string[];
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  APPS = 'APPS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  SETTINGS = 'SETTINGS'
}