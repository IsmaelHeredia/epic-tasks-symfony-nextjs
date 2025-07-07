# Epic Tasks

Este proyecto es un sistema avanzado de gestión de tareas, construido con **Symfony** para el backend, **Next.js** (integrado con **Material UI**) para el frontend, y una base de datos **MySQL**.

## Funcionalidades principales

- Autenticación segura: Autenticación obligatoria basada en JWT con opciones para actualizar el perfil del usuario (nombre de usuario, contraseña y foto de perfil).

- Tema dinámico: Cambia sin problemas entre el modo claro y oscuro.

- Gestión integral de categorías: Operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) para categorías.

- Gestión avanzada de tareas:

    - Operaciones CRUD completas para tareas.

    - Las tareas se pueden organizar por prioridad, estado y categoría.

    - Subtareas: Cada tarea puede incluir subtareas con sus propios campos y una función de búsqueda por nombre.

    - Reordenamiento: Reordena fácilmente las tareas para priorizarlas.

    - Búsqueda y paginación: Busca tareas de manera eficiente por nombre y categoría desde la página principal, respaldado por un sólido sistema de paginación. Redux se utiliza para mantener los filtros de búsqueda mientras navegas por la aplicación.

- Estadísticas Visuales: Visualiza la distribución de tareas por categoría a través de gráficos interactivos.

## Capturas de pantalla

A continuación, se muestran algunas imágenes del sistema en funcionamiento:

![screenshot]()

## Instalación del proyecto

### Backend (Symfony)

Sigue estos pasos para configurar el backend de Symfony:

1. Configuración del Entorno:

- Renombra el archivo **.env.example** a **.env.**

- Configura los parámetros de conexión a tu base de datos MySQL dentro del archivo **.env.**

2. Instalación de Dependencias:

- Ejecuta el siguiente comando para instalar todas las dependencias del proyecto:

```
composer install
```

3. Generación de **APP_SECRET**:

- Genera una clave secreta y actualiza la variable **APP_SECRET** en tu archivo **.env**. Esta clave es crucial para la seguridad de tu aplicación.

```
php -r "echo bin2hex(random_bytes(32));"
```

- Copia el valor generado y pégalo en la línea **APP_SECRET=** de tu archivo **.env**.

4. Configuración de la Base de Datos:

- Crea las migraciones de la base de datos :

```
php bin/console make:migration
```

- Ejecuta las migraciones para crear las tablas en tu base de datos :

```
php bin/console doctrine:migrations:migrate
```

- Carga los datos iniciales (fixtures) en la base de datos :

```
php bin/console doctrine:fixtures:load --append
```

5. Generación de Claves JWT:

Las claves JWT son esenciales para la autenticación segura en la aplicación.

- Crea el directorio para las claves:

```
mkdir -p config/jwt
```

- Genera las claves privada y pública:

Primero, genera la clave privada (**private.pem**). Se te pedirá una **passphrase**. Esta contraseña, la necesitarás para la configuración de **pass_phrase** en el archivo YAML

```
openssl genrsa -out config/jwt/private.pem -aes256 4096
```

- Luego, genera la clave pública (**public.pem**) a partir de la clave privada:

```
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

- Actualiza la pass_phrase en el archivo YAML: Edita el archivo **config/packages/lexik_jwt_authentication.yaml** y actualiza el valor de **pass_phrase:** con la contraseña que ingresaste al generar **private.pem**.

- Configuración en **.env**: Además de la configuración en **lexik_jwt_authentication.yaml**, asegúrate de que tu archivo **.env** contenga las siguientes variables, apuntando a las claves generadas y la **passphras** que definiste:

```
###> lexik/jwt-authentication-bundle ###
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=tu-passphrase # Asegúrate de que esta sea la misma que usaste al generar las claves
###< lexik/jwt-authentication-bundle ###
```

- Establece los permisos de los archivos: Esto es crucial para la seguridad.

```
chmod 600 config/jwt/private.pem
chmod 644 config/jwt/public.pem
```

---

### Frontend (Next.js)

Sigue estos pasos para configurar el frontend de Next.js:

- Renombra el archivo .env.example a .env en el directorio raíz del proyecto frontend.

- Edita el archivo .env y configura las siguientes variables de entorno según tu configuración:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 # URL de tu backend Symfony
NEXTAUTH_SECRET=supersecreto123 # Una cadena secreta larga y aleatoria para NextAuth
NEXT_PUBLIC_TIMEOUT_TOAST=4000
NEXT_PUBLIC_TIMEOUT_REDIRECT=5000
```

- Cambia NEXTAUTH_SECRET por una cadena de caracteres larga, compleja y aleatoria para la seguridad de la autenticación.

Instalación de Dependencias:

- Abre tu terminal en el directorio raíz del proyecto frontend.

- Ejecuta el siguiente comando para instalar todas las dependencias de Node.js:

´´´
npm install
´´´

---

### Iniciar la aplicación

Para poner en marcha la aplicación completa, asegúrate de que tanto el backend de Symfony como el frontend de Next.js estén configurados correctamente siguiendo las instrucciones de instalación respectivas.

1. Iniciar el Backend (Symfony):

- Abre una nueva terminal.

- Navega hasta el directorio raíz de tu proyecto Symfony.

- Ejecuta el siguiente comando para iniciar el servidor de desarrollo de Symfony:

```
symfony serve
```

2. Iniciar el Frontend (Next.js):

- Abre otra nueva terminal (manteniendo la del backend abierta).

- Navega hasta el directorio raíz de tu proyecto Next.js.

Ejecuta el siguiente comando para iniciar el servidor de desarrollo de Next.js:

```
npm run dev
```

Una vez que ambos servidores estén en funcionamiento, la aplicación completa estará accesible a través de la URL del frontend (http://localhost:3000).

---

## Pruebas unitarias

Para ejecutar las pruebas unitarias del backend de Symfony, sigue estos pasos:

- Configuración del Entorno de Pruebas:

1. Renombra el archivo .env.test.example a .env.test en el directorio raíz de tu proyecto Symfony.

2. Edita el archivo .env.test y configura la variable DATABASE_URL para que apunte a una base de datos de pruebas. Es crucial que esta configuración utilice la misma conexión que tu base de datos de desarrollo, ya que PHPUnit, al ser parte del ecosistema Symfony, generará automáticamente una base de datos con el sufijo _test (por ejemplo, si tu base de datos de desarrollo se llama mi_app_db, la de pruebas será mi_app_db_test). Esto asegura que no haya pérdida de datos en tu base de datos de desarrollo.

- Preparación de la Base de Datos de Pruebas:

1. Crea la base de datos de pruebas especificada en DATABASE_URL de tu archivo .env.test:

```
php bin/console doctrine:database:create --env=test
```

2. Ejecuta las migraciones en el entorno de pruebas para asegurar que el esquema de la base de datos esté actualizado para las pruebas:

```
php bin/console doctrine:migrations:migrate --env=test --no-interaction
```

- Ejecutar las Pruebas:

Una vez que la base de datos de pruebas esté configurada, puedes ejecutar todas las pruebas unitarias del proyecto con el siguiente comando:

```
php bin/phpunit --testdox
```