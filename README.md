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

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1A9HMFqscetVEDAhT4KNPWRyyV8vVsHLgevL9Q1-useXHbvvrUEqWlYVYr1T27h1S-dDUe7KNizH4MuVKgxr-ODa_kyt9E0nPbiIrgXa_hpWhFQkadAeZ2dNXzdu1ikMBaqMczIftgejaG7xChgtc_Q_2cZSYKy_rKZrbyPHBMjDGi6O50ZxRXfagM-0/s1919/1.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDyi5Bxu67foJEa6usI2lvlAuR0yj1cUYZvU5pavuiq7qmBst9B1oDuww98BvW71fqnf8YVa9rEQHo7JnuMC5JcfE4_mTH05UmeCEDXx1fxSDPcaFpoesRA1xEXhMhTTogswv-4q4JcyHGe5chpR_QiGuenN91bCNY0FwCXB_ph9j2HNLLcv1CLRYEtBY/s1919/2.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2cQM7FKw38Q5T8GZM6_pHBvVnOnulFxiIUKcw2Pqls2pqP8Slft-HR37SsOaHzlvZZMlDDFHip0-LtOFjl5mNaQkF1eaUgYygb5GBxNHRepkAJkreiYyQEImjqCbMfqHYc46vNynQg8iZt0q9JyzW9ydU0nr7uI4h3v1Z51nHGeQMfeIDNeJgVSTe6ww/s1919/3.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEidybW_DNFrzH5NYs9DrU2T7KTweF0nBUfNoHjmZVKjHwZN0pBAKW7bUfTSfzSWJsgnC2KQ77zbhqrOXPuTwHGmEXS7TlxPrHHeAl7PRwWsBHM2yxEYwCpqXXF3mY5eAxk9XinqH1opvBbzt1WajMRfeIlrhTqR-CWKdD2WQnwbxlVsHw_EgpRrF6zoaM0/s1919/4.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJC7L_yQwW1CVZAxP0ZmrWFCB4NwAco6oJbt6_zK9vEUGOJ9otJqR_Z6Dbn2Att_ILbeYRR-QfmUiYsRDai5BA1nETaoLRejFf2oH6z8zlWmbxcwOUdx507QUysz1r3lrXdKbfA7HUulAIVtVQYhg74xDdxi7RtlMxP-0Q_XxmjOqDy4M2600M5htvKlY/s1919/5.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8jegtjrcjsWaBXF1Er012ux7eRWHFqwE0vMuGQM8adiAGUJWCym-ZTgANQRZ9hISCdwbW1dBM2uZUbL_d4oTcbvnaArgQS4EjXzMRTIgqRLizzYVxF2YlnUrOBX3cwjHE35JlaQF-6dVNRQ0zc6t0n-TzXNa8aCtoAbeyNrgsd6XnC2hwk8q_4ohfRaI/s1919/6.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvdTZLFnYPltqtuDEoUOmOaV1QXGdqSKVXmvxPqug2aw9yfQTXcrtAIpw2pVPHsBs4JHRNJ4-5wrfbfeH0s9kACrmMTupa1UtBH-ccO8mtNBqfTUXqMiYQSAyqF8WeaDj9-5O1lROVpYeu-pkyw0TJhbW5UjZTl8Igx_U68wq_aRQSHp70MsLy9N5hSqU/s1919/7.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5XJt3qoSDAaT7HD7u6x0n8V8_al28a9T2IDgDu1XpzzzCJy8NPkNONljm85vwExXhTxFRFwNNDuySbVIqc_KE3395ImeG11flS7W3irc8ZVncyzmS7acB1vSRy6_7nxda47AJsDyTkrosFEqGW9A9WwtVSfYfHo253GFOfSLhplGrdCKm__SyIXzDUC0/s1919/8.png)

## Instalación del proyecto

### Backend (Symfony)

Sigue estos pasos para configurar el backend de Symfony:

1. Configuración del entorno:

- Renombra el archivo **.env.example** a **.env.**

- Configura los parámetros de conexión a tu base de datos MySQL dentro del archivo **.env.**

2. Instalación de dependencias:

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

4. Configuración de la base de datos:

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

5. Generación de claves JWT:

Las claves JWT son esenciales para la autenticación segura en la aplicación.

- Primero crea el directorio para las claves:

```
mkdir -p config/jwt
```

- Generar la clave privada

Después, crea tu clave privada (private.pem). Se te pedirá que definas una passphrase segura, la cual usarás más adelante para descifrar esta clave.

```
openssl genrsa -out config/jwt/private.pem -aes256 4096
```

- Generar la clave pública

A continuación, genera la clave pública (public.pem) a partir de la clave privada que acabas de crear:

```
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

- Configurar variables de entorno

Asegúrate de que tu archivo de configuración de entorno .env, contenga la siguiente variable:

```
JWT_PASSPHRASE="tu_passphrase_segura"
```

**Importante:** La JWT_PASSPHRASE en tu archivo .env **debe ser exactamente la misma** contraseña que definiste al generar tu clave privada.

- Finalmente los permisos de los archivos: Esto es crucial para la seguridad.

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

Instalación de dependencias:

- Abre tu terminal en el directorio raíz del proyecto frontend.

- Ejecuta el siguiente comando para instalar todas las dependencias de Node.js:

```
npm install
```

---

### Iniciar la aplicación

Para poner en marcha la aplicación completa, asegúrate de que tanto el backend de Symfony como el frontend de Next.js estén configurados correctamente siguiendo las instrucciones de instalación respectivas.

1. Iniciar el backend (Symfony):

- Abre una nueva terminal.

- Navega hasta el directorio raíz de tu proyecto Symfony.

- Ejecuta el siguiente comando para iniciar el servidor de desarrollo de Symfony:

```
symfony serve
```

2. Iniciar el frontend (Next.js):

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

- Configuración del entorno de pruebas:

1. Renombra el archivo .env.test.example a .env.test en el directorio raíz de tu proyecto Symfony.

2. Edita el archivo .env.test y configura la variable DATABASE_URL para que apunte a una base de datos de pruebas. Es crucial que esta configuración utilice la misma conexión que tu base de datos de desarrollo, ya que PHPUnit, al ser parte del ecosistema Symfony, generará automáticamente una base de datos con el sufijo _test (por ejemplo, si tu base de datos de desarrollo se llama mi_app_db, la de pruebas será mi_app_db_test). Esto asegura que no haya pérdida de datos en tu base de datos de desarrollo.

- Preparación de la base de datos de pruebas:

1. Crea la base de datos de pruebas especificada en DATABASE_URL de tu archivo .env.test:

```
php bin/console doctrine:database:create --env=test
```

2. Ejecuta las migraciones en el entorno de pruebas para asegurar que el esquema de la base de datos esté actualizado para las pruebas:

```
php bin/console doctrine:migrations:migrate --env=test --no-interaction
```

- Ejecutar las pruebas:

Una vez que la base de datos de pruebas esté configurada, puedes ejecutar todas las pruebas unitarias del proyecto con el siguiente comando:

```
php bin/phpunit --testdox
```

### Uso con Docker

Para poner en marcha los servicios de Symfony y Next.js usando Docker, se deben seguir los siguientes pasos:

- Configuración del entorno:

1. Renombra el archivo .env.example ubicado en la raíz del proyecto a .env.

2. Generación de clave secreta: Abre el archivo .env y genera una nueva clave para la variable APP_SECRET. Se debe usar el siguiente comando para generar una clave segura:

```
php -r "echo bin2hex(random_bytes(32));"
```

Pega la clave generada como valor de APP_SECRET en tu archivo .env.

3. Iniciar servicios: Ejecuta el siguiente comando en tu terminal desde la raíz del proyecto para construir y levantar todos los servicios configurados:

```
docker compose up -d --build
```

Una vez que los servicios estén activos, se podran acceder desde las siguientes URLs:

Backend Symfony: http://localhost:9090

phpMyAdmin: http://localhost:8080

Frontend Next.js: http://localhost:3000