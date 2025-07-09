#!/bin/bash

APP_DIR=/var/www/html

echo "[ENTRYPOINT] Iniciando entrypoint para la aplicación Symfony..."

echo "[INFO] Esperando a que el servicio MySQL esté disponible..."

while ! nc -z mysql 3306; do
  sleep 1
done

echo "[INFO] MySQL ya está disponible. Se continua con la configuración de Symfony."

echo "[INFO] Configurando permisos para directorios de Symfony ..."

mkdir -p "$APP_DIR/var/cache"
mkdir -p "$APP_DIR/var/log"
mkdir -p "$APP_DIR/public/uploads/usuarios"
mkdir -p "$APP_DIR/config/jwt"              

chown -R www-data:www-data \
  "$APP_DIR/var/cache" \
  "$APP_DIR/var/log" \
  "$APP_DIR/public/uploads" \
  "$APP_DIR/config/jwt"

chmod -R ug+rwX \
  "$APP_DIR/var/cache" \
  "$APP_DIR/var/log" \
  "$APP_DIR/public/uploads" \
  "$APP_DIR/config/jwt"

if [ ! -d "$APP_DIR/vendor" ]; then
  echo "[INFO] El directorio 'vendor' no existe. Ejecutando composer install..."
  composer install --no-interaction --prefer-dist --optimize-autoloader
else
  echo "[INFO] El directorio 'vendor' ya existe. Omitiendo composer install."
fi

PRIVATE_KEY_PATH="$APP_DIR/config/jwt/private.pem"
PUBLIC_KEY_PATH="$APP_DIR/config/jwt/public.pem"

JWT_PASSPHRASE="${JWT_PASSPHRASE}"

if [ ! -f "$PRIVATE_KEY_PATH" ] || [ ! -f "$PUBLIC_KEY_PATH" ]; then
  echo "[INFO] Claves JWT no encontradas. Generando nuevas claves..."

  openssl genrsa -out "$PRIVATE_KEY_PATH" -aes256 4096 -passout pass:"$JWT_PASSPHRASE"

  openssl rsa -pubout -in "$PRIVATE_KEY_PATH" -out "$PUBLIC_KEY_PATH" -passin pass:"$JWT_PASSPHRASE"

  chmod 600 "$PRIVATE_KEY_PATH"
  chmod 644 "$PUBLIC_KEY_PATH"
  echo "[INFO] Claves JWT generadas y permisos configurados."
else
  echo "[INFO] Claves JWT ya existen. Omitiendo generación."
fi

echo "[INFO] Limpiando la caché de Symfony..."

php bin/console cache:clear --no-interaction

php bin/console cache:warmup --no-interaction

echo "[INFO] Ejecutando migraciones de Doctrine..."

php bin/console doctrine:migrations:migrate --no-interaction

php bin/console doctrine:fixtures:load --append

echo "[ENTRYPOINT] Lanzando Apache en primer plano..."

exec apache2-foreground

