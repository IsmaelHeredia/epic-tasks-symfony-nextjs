<?php

namespace App\Service;

use App\DTO\SubtareaDTO;
use App\Repository\SubtareaRepository;
use App\Repository\EstadoRepository;
use App\Repository\PrioridadRepository;
use App\Repository\CategoriaRepository;
use App\Repository\TareaRepository;

class SubtareaService
{
    public function __construct(
        private SubtareaRepository $subtareaRepository,
        private EstadoRepository $estadoRepository,
        private PrioridadRepository $prioridadRepository,
        private CategoriaRepository $categoriaRepository,
        private TareaRepository $tareaRepository,
    ) {}

    public function listar()
    {
        return $this->subtareaRepository->listar();
    }

    public function obtener(int $id)
    {
        return $this->subtareaRepository->obtener($id);
    }

    public function crear(SubTareaDTO $dto)
    {
        return $this->subtareaRepository->crear($dto);
    }

    public function actualizar(int $id, SubTareaDTO $dto)
    {
        return $this->subtareaRepository->actualizar($id, $dto);
    }

    public function eliminar(int $id)
    {
        return $this->subtareaRepository->eliminar($id);
    }
}
