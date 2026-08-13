import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Rentals = {
  id: number;
  vehicle_id: number;
  customer_name?: string;
  total: number;
  status: string;
  created_at?: string;
};

export async function listRentalsPublicApi() {
  const { data } = await http.get<Paginated<Rentals>>("/api/rentals/");
  return data; // { ... , results: [] }
}

export async function listRentalsAdminApi() {
  const { data } = await http.get<Paginated<Rentals>>("/api/rentals/");
  return data;
}

export async function createRentalsApi(payload: Omit<Rentals, "id">) {
  const { data } = await http.post<Rentals>("/api/rentals/", payload);
  return data;
}

export async function updateRentalsApi(id: number, payload: Partial<Rentals>) {
  const { data } = await http.put<Rentals>(`/api/rentals/${id}/`, payload);
  return data;
}

export async function deleteRentalsApi(id: number) {
  await http.delete(`/api/rentals/${id}/`);
}