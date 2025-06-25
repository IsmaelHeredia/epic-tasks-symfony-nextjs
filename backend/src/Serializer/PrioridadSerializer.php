<?php

namespace App\Serializer;

use App\Entity\Prioridad;

class PrioridadSerializer
{
    public static function serialize(Prioridad $prioridad): array
    {
        return [
            'id' => $prioridad->getId(),
            'nombre' => $prioridad->getNombre(),
        ];
    }
}
