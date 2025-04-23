<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CategoriaDTO
{
    public ?int $id = null;

    #[Assert\NotBlank(message: 'El nombre de la categoría es obligatorio')]
    #[Assert\Length(
        min: 2,
        max: 255,
        minMessage: 'El nombre debe tener al menos {{ limit }} caracteres',
        maxMessage: 'El nombre no debe exceder los {{ limit }} caracteres'
    )]
    public ?string $nombre = null;

    public function __construct(?string $nombre = null, ?int $id = null)
    {
        $this->nombre = $nombre;
        $this->id = $id;
    }
}
