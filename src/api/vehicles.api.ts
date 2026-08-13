import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Vehicles = { 
    id: number; 
    plate: string; 
    brand: string; 
    daily_rate: number;

};

export async function listVehiclesApi() {
  const { data } = await http.get<Paginated<Vehicles>>("/api/vehicles/");
  return data; // { count, next, previous, results }
}

export async function createVehiclesApi(nombre: string) {
  const { data } = await http.post<Vehicles>("/api/vehicles/", { nombre });
  return data;
}

export async function updateVehiclesApi(id: number, nombre: string) {
  const { data } = await http.put<Vehicles>(`/api/vehicles/${id}/`, { nombre });
  return data;
}

export async function deleteVehiclesApi(id: number) {
  await http.delete(`/api/Vehicless/${id}/`);
}