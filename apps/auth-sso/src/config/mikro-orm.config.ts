import { MongoDriver } from '@mikro-orm/mongodb';
import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Cargamos variables de entorno para que el CLI de MikroORM también las detecte
dotenv.config();
const configService = new ConfigService();

const databaseConfig: Options = {
  // 1. Cambiamos el driver a MongoDB
  driver: MongoDriver,
  
  // 2. URL de conexión (Se recomienda usar MONGO_URL en el .env)
  clientUrl: configService.get<string>('MONGO_URL') || 'mongodb://localhost:27017',
  
  // 3. Nombre de la base de datos para la prueba de IMIX
  dbName: configService.get<string>('MONGO_DB') || 'imix_auth_db',
  
  // 4. Configuración de rutas de entidades
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  
  // 5. Debug según el entorno
  debug: configService.get<string>('MONGO_DEBUG') === 'true',
  
  // En Mongo, persistOnCreate suele dejarse en true para facilitar el guardado
  persistOnCreate: true,

  // 6. Opciones del driver de MongoDB
  driverOptions: {
    // Recomendado para evitar advertencias de deprecación
    useUnifiedTopology: true, 
  },

  allowGlobalContext: true,
};

export default databaseConfig;