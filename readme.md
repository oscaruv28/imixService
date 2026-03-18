DESARROLLO TÉCNICO PRUEBA IMIX

1. Definición del Problema y Solución
El proyecto aborda la falta de historial crediticio tradicional en sectores no bancarizados. La solución consiste en una plataforma digital que permite capturar solicitudes de microcrédito y procesarlas mediante un motor de Inteligencia Artificial. El sistema analiza datos de comportamiento transaccional para generar una respuesta de aprobación o rechazo de forma inmediata y automatizada.

2. Arquitectura de Sistema y Capas
La solución se basa en una Arquitectura de Microservicios Desacoplados, organizada en las siguientes capas funcionales:

Capa de Cliente: Interfaz desarrollada en Angular con lógica de renderizado adaptativo para entornos Web y Móvil.

Capa de Acceso (API Gateway): Punto de entrada único que gestiona el ruteo, la seguridad perimetral y la transformación de peticiones.

Capa de Negocio (Backend): Servicios en NestJS encargados de la orquestación de créditos y la ejecución del motor de IA.

Capa de Datos: Persistencia documental en MongoDB y una capa de aceleración en memoria con Redis.

3. Flujo de Operación y Enriquecimiento de Datos
Para optimizar el rendimiento y cumplir con la restricción de no saturar la base de datos principal, se implementa un flujo de hidratación de datos:

Autenticación: Al iniciar sesión, el servicio de identidad (SSO) recupera el perfil del usuario de MongoDB y lo almacena en Redis.

Solicitud: El cliente envía solo el monto y su identificador mediante un token JWT.

Intervención del Gateway: El API Gateway valida el token, extrae la información sensible desde Redis y la inyecta en los encabezados de la petición hacia el backend.

Procesamiento: El backend recibe la data enriquecida y dispara el motor de IA. El resultado final se persiste en MongoDB y se notifica al cliente.

4. Seguridad y Protección de Información Sensible
La seguridad se centraliza en el API Gateway, lo que permite que los servicios internos sean agnósticos a la lógica de autenticación. La información confidencial (ingresos, historial detallado) reside exclusivamente en el servidor (Redis/MongoDB) y nunca es expuesta al Frontend. El cliente solo interactúa con identificadores y resultados procesados, garantizando la privacidad de los datos del solicitante en todo momento.

5. Estrategia Multi-Interfaz (Web y Móvil)
Se utiliza un enfoque de Componentes Desacoplados de la Capa de Estilo. El sistema comparte una única base de lógica de negocio y servicios de datos en Angular, pero aplica hojas de estilo y plantillas diferenciadas según la plataforma. Esto permite ofrecer una experiencia táctil nativa en dispositivos móviles y un panel de gestión robusto en entorno web sin duplicar el código de backend.

6. Manejo de Sesión y Single Sign On (SSO)
La sesión se gestiona mediante tokens JWT de corta duración para mantener un esquema sin estado (stateless) que facilite el escalado horizontal. La integración de SSO se proyecta bajo el estándar OpenID Connect, donde un servidor de identidad federado gestiona las credenciales. Esto evita que la aplicación de microcréditos almacene datos sensibles de acceso, delegando la responsabilidad a un componente especializado.

7. Escalabilidad y Criterio Técnico en Producción
Modelo de Despliegue: Uso de contenedores Docker orquestados por Kubernetes para permitir el auto-escalado según la demanda.

Escalabilidad Transaccional: La implementación de Redis reduce drásticamente la latencia de lectura y la carga sobre MongoDB durante picos de concurrencia.

Límites de Responsabilidad: Se establece una separación clara donde el Frontend valida la entrada, el Backend orquesta la transacción y la IA dictamina el riesgo. Cada componente es independiente, lo que facilita el mantenimiento y la evolución tecnológica del sistema.

Arquitectura General
imixService/
├── 📄 README.md             <-- (El diseño, respuestas técnicas y guía de inicio) 
├── 📄 docker-compose.yml    <-- (Para levantar MongoDB, Redis y los servicios) [cite: 42,43]
│
├── 📂 apps/               
│   ├── 📂 api-gateway/      
│   ├── 📂 auth-sso/
│   └── 📂 credits-backend/
│
├── 📂 client/               <-- (Proyecto Frontend/Angular) 
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── 📂 web/      <-- (Componentes para Desktop) 
│   │   │   └── 📂 mobile/   <-- (Componentes para Mobile) 
│   └── ...
│
├── 📂 docs/                 <-- (Diagramas de arquitectura y diseño)
   └── 🖼️ arquitectura.png


INSTALACION Y DESPLIEGUE
## Instalación y Despliegue Local
Este proyecto utiliza una arquitectura de microservicios desacoplados. Para levantar el entorno de desarrollo localmente, sigue estos pasos:

### 1. Instalación de Dependencias
Es necesario instalar los paquetes de Node (`node_modules`) de manera independiente para el cliente y para cada uno de los microservicios. Desde la raíz del proyecto (`imixService/`), ejecuta:

**Capa de Cliente (Angular):**
```bash
cd client
npm install
cd ..
Capa de Negocio y Acceso (NestJS):

Bash
cd imixservice --> para el api-gateway
npm install
cd ../..

cd apps/auth-sso
npm install
cd ../..

cd apps/credits-backend
npm install
cd ../..

2. Levantar la Instancia (Docker)
Toda la infraestructura (MongoDB, Redis, API Gateway y microservicios) está orquestada mediante Docker. Asegúrate de tener el demonio de Docker en ejecución y corre el siguiente comando desde la raíz del proyecto (imixService/):

Bash
docker-compose up -d --build
(Nota: El flag -d levanta los contenedores en segundo plano. Si deseas monitorear los logs en tiempo real para verificar el flujo de hidratación de datos en Redis, utiliza docker-compose logs -f).


3. Arranque en Modo Desarrollo (Manual)
Si deseas levantar el entorno de desarrollo para editar código en tiempo real, deberás abrir una terminal para cada servicio y ejecutar sus respectivos comandos de arranque:

Terminal 1 - Frontend (Angular):
Bash
cd client
npm start

Terminal 2 - API Gateway:
Bash
# Como las dependencias están en la raíz, el script se corre desde aquí
npm run start:dev api-gateway

Terminal 3 - Servicio de Autenticación (SSO):
Bash
cd apps/auth-sso
npm run start:dev

Terminal 4 - Backend de Créditos:
Bash
cd apps/credits-backend
npm run start:dev

4. Credenciales de Acceso por Defecto
Una vez que los servicios estén arriba y el SSO inicializado, puedes acceder a la interfaz de InclusionScore AI utilizando el superusuario administrador preconfigurado:
- Usuario: admin
- Contraseña: password123

5. SWAGGER DOCUMENTATION
Una vez se corran los servicios del backend se pueden probar en swagger los endpoints configurados, hay un endpoint get para ver que si se guardan las peticiones de credito en la db con el id del usuario que genero el token



RESPONDE BREVEMMENTE
Parte 4 – Criterio técnico
¿Cuál sería el mejor modelo de despliegue para esta solución?
El modelo ideal es una arquitectura contenerizada usando Docker, orquestada mediante un clúster de Kubernetes (K8s) en la nube (AWS/GCP/Azure). Esto permite gestionar los microservicios de forma independiente, aplicar auto-escalado horizontal basado en métricas (CPU/RAM) y garantizar alta disponibilidad.

¿Cómo esta solución es escalable en volúmenes transaccionales, concurrencia y datos?

Transacciones y Concurrencia: Al ser stateless (usando JWT), los pods de NestJS pueden multiplicarse horizontalmente sin problemas de sesión. El API Gateway distribuye la carga.

Datos: La estrategia de Data Hydration con Redis absorbe los picos de lectura durante la concurrencia masiva. Para el almacenamiento a largo plazo, MongoDB permite sharding (fragmentación) para escalar horizontalmente bases de datos de gran volumen.

¿Qué mejorarías en producción?

Autenticación: Reemplazaría el microservicio simulado (auth-sso) por un servidor de identidad federado real (como Keycloak o Auth0) usando OpenID Connect.

Procesamiento Asíncrono: Extraería el motor de IA a un worker independiente y usaría un Message Broker (como RabbitMQ o Kafka) para encolar las solicitudes, evitando que consultas lentas bloqueen la API principal.

CI/CD y Monitoreo: Implementaría pipelines automáticos de despliegue y herramientas de observabilidad (Datadog, Prometheus/Grafana) para trazar las peticiones entre microservicios.

¿Dónde pondrías límites de responsabilidad entre servicios?
Establecería fronteras estrictas:

API Gateway: Se encarga solo del enrutamiento, validación del token JWT y limitación de peticiones (Rate Limiting). Cero lógica de negocio.

Servicio de SSO: Se encarga solo de validar credenciales y emitir tokens.

Backend de Créditos (Orquestador): Aplica reglas de negocio, coordina las bases de datos y orquesta el flujo, pero no hace los cálculos matemáticos pesados.

Motor de IA: Recibe un payload limpio del backend, calcula el score de riesgo y devuelve el resultado. No sabe de dónde viene el usuario ni cómo se autenticó.