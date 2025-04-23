<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class PrioridadDTO
{
    public ?int $id = null;

    #[Assert\NotBlank(message: 'El nombre de la prioridad es obligatorio')]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'El nombre debe tener al menos {{ limit }} caracteres',
        maxMessage: 'El nombre no debe exceder los {{ limit }} caracteres'
    )]
    public ?string $nombre = null;

    #[Assert\NotBlank(message: 'El color de la prioridad es obligatorio')]
    public ?string $color = null;

    public function __construct(?string $nombre = null, ?string $color = null, ?int $id = null)
    {
        $this->nombre = $nombre;
        $this->color = $color;
        $this->id = $id;
    }
}
