<?php

namespace App\Serializer;

use App\Entity\Tarea;

class TareaSerializer
{
    public static function serialize(Tarea $tarea): array
    {
        return [
            'id' => $tarea->getId(),
            'titulo' => $tarea->getTitulo(),
            'contenido' => $tarea->getContenido(),
            'orden' => $tarea->getOrden(),
            'estado' => $tarea->getEstado() ? [
                'id' => $tarea->getEstado()->getId(),
                'nombre' => $tarea->getEstado()->getNombre(),
            ] : null,
            'prioridad' => $tarea->getPrioridad() ? [
                'id' => $tarea->getPrioridad()->getId(),
                'nombre' => $tarea->getPrioridad()->getNombre(),
            ] : null,
            'categorias' => array_map(
                fn($cat) => [
                    'id' => $cat->getId(),
                    'nombre' => $cat->getNombre(),
                ],
                $tarea->getCategorias()->toArray()
            ),
            'subtareas' => array_map(
                fn($sub) => \App\Serializer\SubtareaSerializer::serialize($sub),
                $tarea->getSubtareas()->toArray()
            ),
            'createdAt' => $tarea->getCreatedAt()->format('Y-m-d H:i:s'),
            'updatedAt' => $tarea->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}