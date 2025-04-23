<?php

namespace App\Serializer;

use App\Entity\Categoria;

class CategoriaSerializer
{
    public static function serialize(Categoria $categoria): array
    {
        return [
            'id' => $categoria->getId(),
            'nombre' => $categoria->getNombre(),
        ];
    }
}
