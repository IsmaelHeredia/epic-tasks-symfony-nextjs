<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;
use App\DTO\SubtareaDTO;

class TareaDTO
{
    #[Assert\NotBlank(message: 'El título es obligatorio')]
    public ?string $titulo = null;

    #[Assert\NotBlank(message: 'El contenido es obligatorio')]
    public ?string $contenido = null;

    #[Assert\NotBlank(message: 'El orden es obligatorio')]
    #[Assert\Type(type: 'integer', message: 'El orden debe ser un número')]
    public ?int $orden = null;

    #[Assert\NotNull(message: 'El estado es obligatorio')]
    public ?int $estadoId = null;

    #[Assert\NotNull(message: 'La prioridad es obligatoria')]
    public ?int $prioridadId = null;

    #[Assert\NotNull(message: 'Las categorías son obligatorias')]
    #[Assert\Count(min: 1, minMessage: 'Debe incluir al menos una categoría')]
    public ?array $categoriasId = [];

    #[Assert\Valid]
    public array $subtareas = [];
}
