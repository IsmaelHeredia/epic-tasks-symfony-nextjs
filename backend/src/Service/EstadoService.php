<?php

namespace App\Service;

use App\DTO\EstadoDTO;
use App\Repository\EstadoRepository;

class EstadoService
{
    public function __construct(private EstadoRepository $estadoRepository) {}

    public function listar()
    {
        return $this->estadoRepository->listar();
    }

    public function obtener(int $id)
    {
        return $this->estadoRepository->obtener($id);
    }

    public function crear(EstadoDTO $dto)
    {
        return $this->estadoRepository->crear($dto);
    }

    public function actualizar(int $id, EstadoDTO $dto)
    {
        return $this->estadoRepository->actualizar($id, $dto);
    }

    public function eliminar(int $id)
    {
        return $this->estadoRepository->eliminar($id);
    }
}
