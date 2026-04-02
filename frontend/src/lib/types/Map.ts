export interface GameMap {
  id: string;
  campaign_id: string;
  name: string;
  file_size: number;
  original_size: number;
  width: number;
  height: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MapSummary {
  id: string;
  name: string;
  file_size: number;
  width: number;
  height: number;
  created_at: string;
}

export interface MapMarker {
  id?: string;
  map_id?: string;
  pos_x: number;
  pos_y: number;
  label?: string;
  document_id?: string;
  created_at?: string;
}

export interface MapDetail extends GameMap {
  markers: MapMarker[];
}
