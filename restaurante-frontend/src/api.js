import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function entrar(email, senha) {
  const { data } = await api.post("/auth/login", { email, senha });
  if (data.token) localStorage.setItem("token", data.token);
  if (data.expiraEm) localStorage.setItem("expiraEm", data.expiraEm);
  if (data.usuario) localStorage.setItem("usuario", JSON.stringify(data.usuario));
  return data;
}
export async function cadastrar(dados) {
  return (await api.post("/auth/cadastro", dados)).data;
}
export async function criarPedido(payload) {
  // Rota esperada: POST /pedidos. Ela ainda precisa ser implementada no backend.
  return (await api.post("/pedidos", payload)).data;
}
export async function pagarPedido(id, metodo) {
  return (await api.post(`/pedidos/${id}/pagamento-teste`, {
    metodo, resultado: "aprovado"
  })).data;
}
export async function abrirComprovante(id, tipo = "cliente") {
  const response = await api.get(`/pedidos/${id}/comprovante?tipo=${tipo}`, {
    responseType: "blob"
  });
  const url = URL.createObjectURL(response.data);
  window.open(url, "_blank", "noopener,noreferrer");
}
export default api;