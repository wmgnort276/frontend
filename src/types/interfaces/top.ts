export interface Notifications {
  business_division: Array<any>;
  created_at: any;
  content: string;
}

export interface InformationNotifications {
  updated_at: any;
  content: string;
  status: string | null;
  id: number | null;
}

export interface RequestNotifications {
  reception_no: Array<any>;
  requested_date: any;
  request_content: string;
  situation: number;
}
