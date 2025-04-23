<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class UsuarioLoginDTO
{
    #[Assert\NotBlank]
    public ?string $nombre = null;

    #[Assert\NotBlank]
    public ?string $clave = null;
}