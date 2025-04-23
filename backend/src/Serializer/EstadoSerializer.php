<?php

namespace App\Serializer;

use App\Entity\Estado;

class EstadoSerializer
{
    public static function serialize(Estado $estado): array
    {
        return [
            'id' => $estado->getId(),
            'nombre' => $estado->getNombre(),
        ];
    }
}
