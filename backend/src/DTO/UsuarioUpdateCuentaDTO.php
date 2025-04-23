<?php

namespace App\DTO;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class UsuarioUpdateCuentaDTO
{
    public ?string $nombre = null;

    public ?string $clave = null;

    public ?UploadedFile $imagen = null;
}
