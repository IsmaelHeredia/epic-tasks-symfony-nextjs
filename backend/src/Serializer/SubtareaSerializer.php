<?php

namespace App\Serializer;

use App\Entity\Subtarea;

class SubtareaSerializer
{
    public static function serialize(Subtarea $sub): array
    {
        return [
            'id' => $sub->getId(),
            'titulo' => $sub->getTitulo(),
            'contenido' => $sub->getContenido(),
            'orden' => $sub->getOrden(),
            'estado' => $sub->getEstado() ? [
                'id' => $sub->getEstado()->getId(),
                'nombre' => $sub->getEstado()->getNombre(),
            ] : null,
            'prioridad' => $sub->getPrioridad() ? [
                'id' => $sub->getPrioridad()->getId(),
                'nombre' => $sub->getPrioridad()->getNombre(),
            ] : null,
            'categorias' => array_map(
                fn($cat) => [
                    'id' => $cat->getId(),
                    'nombre' => $cat->getNombre(),
                ],
                $sub->getCategorias()->toArray()
            ),
            'createdAt' => $sub->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $sub->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
