import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Vehicles, listVehiclesApi } from "../api/vehicles.api";
import { type Rentals, listRentalsAdminApi, createRentalsApi, updateRentalsApi, deleteRentalsApi } from "../api/rentals.api";

export default function AdminRentalsPage() {
  const [items, setItems] = useState<Rentals[]>([]);
  const [marcas, setMarcas] = useState<Vehicles[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [marca, setMarca] = useState<number>(0);
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState(2020);
  const [placa, setPlaca] = useState("");
  const [color, setColor] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listRentalsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  const loadMarcas = async () => {
    try {
      const data = await listVehiclesApi();
      setMarcas(data.results); // DRF paginado
      if (!marca && data.results.length > 0) setMarca(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadMarcas(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!marca) return setError("Seleccione un vehiculo");
      if (!modelo.trim() || !placa.trim()) return setError("Modelo y placa son requeridos");

      const payload = {
        vehicle_id: Number(marca),
        customer_name: modelo.trim(),
        total: Number(anio),
        status: placa.trim(),
        color: color.trim(),
      };

      if (editId) await updateRentalsApi(editId, payload);
      else await createRentalsApi(payload as any);

      setEditId(null);
      setModelo("");
      setPlaca("");
      setColor("");
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Vehiculo) => {
    setEditId(v.id);
    setMarca(v.marca);
    setModelo(v.modelo);
    setAnio(v.anio);
    setPlaca(v.placa);
    setColor(v.color || "");
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteVehiculoApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="marca-label">Marca</InputLabel>
              <Select
                labelId="marca-label"
                label="Marca"
                value={marca}
                onChange={(e) => setMarca(Number(e.target.value))}
              >
                {marcas.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.plate} (#{m.id}) {m.brand} {m.daily_rate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Placa" value={placa} onChange={(e) => setPlaca(e.target.value)} sx={{ width: 220 }} />
            <TextField label="Color" value={color} onChange={(e) => setColor(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setModelo(""); setPlaca(""); setColor(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadMarcas(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.marca_nombre ?? v.marca}</TableCell>
                <TableCell>{v.modelo}</TableCell>
                <TableCell>{v.anio}</TableCell>
                <TableCell>{v.placa}</TableCell>
                <TableCell>{v.color || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}