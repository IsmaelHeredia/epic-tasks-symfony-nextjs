<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class SubtareaDTO
{
    #[Assert\NotBlank(message: 'El título es obligatorio')]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: 'El título debe tener al menos {{ limit }} caracteres',
        maxMessage: 'El título no debe exceder los {{ limit }} caracteres'
    )]
    public string $titulo;

    #[Assert\NotBlank(message: 'El contenido es obligatorio')]
    public string $contenido;

    #[Assert\NotNull(message: 'El orden es obligatorio')]
    #[Assert\Type(type: 'integer', message: 'El orden debe ser un número entero')]
    public int $orden;

    public ?int $estadoId = null;

    public ?int $prioridadId = null;

    public ?int $tareaId = null;

    #[Assert\Type('array')]
    public array $categoriasId = [];
}
