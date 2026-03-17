import { registerAs } from '@nestjs/config';

export default registerAs('default', () => {
  // Establecemos el entorno por defecto si no existe
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  return {
    // Usamos ?? "" para asegurar que siempre pase un string a parseInt
    port: parseInt(process.env.PORT ?? '3001', 10),
    
    environment: process.env.NODE_ENV,
    
    // Lo mismo aquí para asegurar que adminUrl sea string
    adminUrl: process.env.ADMIN_URL ?? 'http://localhost:4200',

    serviceName: 'imix-auth-sso',
  };
});