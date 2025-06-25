<?php

namespace App\Service;

use App\DTO\TareaDTO;
use App\Repository\TareaRepository;
use App\Repository\EstadoRepository;
use App\Repository\PrioridadRepository;
use App\Repository\CategoriaRepository;
use App\Serializer\TareaSerializer;

class TareaService
{
    public function __construct(
        private TareaRepository $tareaRepository,
        private EstadoRepository $estadoRepository,
        private PrioridadRepository $prioridadRepository,
        private CategoriaRepository $categoriaRepository,
    ) {}

    public function listar(?string $titulo = null, ?array $categoriaIds = null, int $page = 1, int $limit = 10): array
    {
        $result = $this->tareaRepository->findTareasByCriteria($titulo, $categoriaIds, $page, $limit);

        $tareas = $result['tareas'];
        $totalCount = $result['totalCount'];

        $datos = array_map([TareaSerializer::class, 'serialize'], $tareas);

        $totalPages = (int) ceil($totalCount / $limit);
        if ($totalPages == 0 && $totalCount > 0) {
            $totalPages = 1;
        } elseif ($totalCount === 0) {
            $totalPages = 0;
        }

        return [
            'tareas' => $datos,
            'currentPage' => $page,
            'perPage' => $limit,
            'totalPages' => $totalPages,
            'totalCount' => $totalCount,
        ];
    }

    public function obtener(int $id)
    {
        return $this->tareaRepository->obtener($id);
    }

    public function crear(TareaDTO $dto)
    {
        return $this->tareaRepository->crear($dto);
    }

    public function actualizar(int $id, TareaDTO $dto)
    {
        return $this->tareaRepository->actualizar($id, $dto);
    }

    public function cambiarOrden(int $id, TareaDTO $dto) {
        return $this->tareaRepository->cambiarOrden($id, $dto);
    }

    public function eliminar(int $id)
    {
        return $this->tareaRepository->eliminar($id);
    }
}