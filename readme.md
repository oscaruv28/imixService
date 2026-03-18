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
│   └── 🖼️ arquitectura.png
│
└── 📂 infrastructure/       <-- (Configuraciones de DB y Scripts)
    ├── 📂 mongo-init/
    └── 📂 redis-config/