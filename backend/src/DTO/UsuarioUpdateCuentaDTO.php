<?php

namespace App\DTO;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class UsuarioUpdateCuentaDTO
{
    public ?string $nombre = null;

    #[Assert\NotBlank(
        message: 'La contraseña no puede estar vacía.',
        groups: ['password_update']
    )]
    #[Assert\Length(
        min: 8,
        max: 255,
        minMessage: 'La contraseña debe tener al menos {{ limit }} caracteres.',
        maxMessage: 'La contraseña no puede tener más de {{ limit }} caracteres.'
    )]
    #[Assert\Regex(
        pattern: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/',
        message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.'
    )]
    public ?string $clave = null;

    #[Assert\File(
        maxSize: '20M',
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        mimeTypesMessage: 'Por favor, sube una imagen válida (JPG, PNG, GIF).',
        maxSizeMessage: 'El tamaño máximo de la imagen es {{ limit }}.'
    )]
    public ?UploadedFile $imagen = null;

    #[Assert\NotBlank(message: "La contraseña actual es obligatoria para actualizar el perfil.")]
    public ?string $currentPassword = null;

    public function __construct(
        ?string $nombre = null,
        ?string $clave = null,
        ?UploadedFile $imagen = null,
        ?string $currentPassword = null
    ) {
        $this->nombre = $nombre;
        $this->clave = $clave;
        $this->imagen = $imagen;
        $this->currentPassword = $currentPassword;
    }
}
