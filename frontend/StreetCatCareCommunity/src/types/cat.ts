interface cat {
  name: string;
  breed: string;
  gender: string;
  age_months: number;
  health_status: string;
  description: string;
  photos: string[];
  is_neutered: boolean;
  vaccination_status: string;
  status: string;
  shelter_id: string;
  created_by: string;
  id: string;
  created_at: string;
  favorite: number;
  comment: number;
  view: number;
  like: number;
  updated_at: string;
}

interface importCat {
    name: string;
    breed: string;
    gender: string;
    age_months: number;
    health_status: string;
    description: string;
    photos: string[];
    is_neutered: boolean;
    vaccination_status: string;
    status: string;
    shelter_id: string;
    created_by: string;
}

interface updateCat {
    name: string;
    breed: string;
    gender: string;
    age_months: number;
    health_status: string;
    description: string;
    photos: string[];
    is_neutered: boolean;
    vaccination_status: string;
    status: string;
    shelter_id: string;
    created_by: string;
    id: string;
}