export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  // Preparar headers con autenticación
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {})
  };

  // Agregar token de autorización si existe
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
    ...options,
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Error en la petición');
  }
  
  return res.json();
} 