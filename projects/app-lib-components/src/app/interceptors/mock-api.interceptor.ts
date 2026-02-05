import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface ExampleRowData {
  id: string;
  name: string;
  email: string;
  age: number;
  status: string;
}

interface ITableNgData<T = any> {
  id: string;
  rowData: T;
  raw: any;
  onClick: () => void;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Interceptar peticiones a /api/users (paginadas) y /api/users/export (para Excel)
  if (req.url.includes('/api/users')) {
    const params = req.params;
    const isExport = req.url.includes('/export');
    const skip = parseInt(params.get('skip') || '0', 10);
    const limit = parseInt(params.get('limit') || (isExport ? '10000' : '10'), 10);
    
    // Extraer filtros de los parámetros
    const filters: Record<string, any> = {};
    params.keys().forEach(key => {
      if (key.startsWith('filter[')) {
        const filterKey = key.replace('filter[', '').replace(']', '');
        filters[filterKey] = params.get(key);
      }
    });

    // Simular recepción de filtros en el servidor (interceptor)
    console.log('🌐 [Interceptor] Petición HTTP interceptada:', {
      method: req.method,
      url: req.url,
      filters: Object.keys(filters).length > 0 ? filters : 'Sin filtros',
      pagination: { skip, limit },
      fullUrl: `${req.url}?${params.toString()}`
    });

    // Generar datos mock
    const allData: ITableNgData<ExampleRowData>[] = [];
    
    for (let i = 1; i <= 100; i++) {
      const name = `Usuario ${i}`;
      const email = `usuario${i}@example.com`;
      const status = i % 2 === 0 ? 'Activo' : 'Inactivo';
      
      // Aplicar filtros si existen
      let shouldInclude = true;
      if (filters['name'] && !name.toLowerCase().includes(filters['name'].toLowerCase())) {
        shouldInclude = false;
      }
      if (filters['status'] && status !== filters['status']) {
        shouldInclude = false;
      }
      
      if (shouldInclude) {
        allData.push({
          id: i.toString(),
          rowData: {
            id: i.toString(),
            name,
            email,
            age: 20 + (i % 30),
            status
          },
          raw: {},
          onClick: () => {}
        });
      }
    }
    
    // Para exportación, devolver todos los datos filtrados
    // Para paginación normal, aplicar paginación
    const responseData = isExport ? allData : allData.slice(skip, skip + limit);
    
    const response: ApiResponse<ITableNgData<ExampleRowData>> = {
      data: responseData,
      total: allData.length,
      skip: isExport ? 0 : skip,
      limit: isExport ? allData.length : limit
    };

    // Simular respuesta HTTP con delay (más tiempo para exportación)
    return of(new HttpResponse({
      status: 200,
      statusText: 'OK',
      body: response
    })).pipe(
      delay(isExport ? 800 : 500) // Más delay para exportación
    );
  }

  // Para otras peticiones, continuar con el flujo normal
  return next(req);
};

