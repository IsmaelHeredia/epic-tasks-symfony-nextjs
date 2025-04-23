<?php

namespace App\Service;

use App\DTO\TareaDTO;
use App\Repository\TareaRepository;
use App\Repository\EstadoRepository;
use App\Repository\PrioridadRepository;
use App\Repository\CategoriaRepository;

class TareaService
{
    public function __construct(
        private TareaRepository $tareaRepository,
        private EstadoRepository $estadoRepository,
        private PrioridadRepository $prioridadRepository,
        private CategoriaRepository $categoriaRepository,
    ) {}

    public function listar()
    {
        return $this->tareaRepository->listar();
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

    public function eliminar(int $id)
    {
        return $this->tareaRepository->eliminar($id);
    }
}