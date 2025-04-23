<?php

namespace App\Service;

use App\DTO\CategoriaDTO;
use App\Repository\CategoriaRepository;

class CategoriaService
{
    public function __construct(
        private readonly CategoriaRepository $categoriaRepository
    ) {}

    public function listar()
    {
        return $this->categoriaRepository->listar();
    }

    public function obtener(int $id)
    {
        return $this->categoriaRepository->obtener($id);
    }

    public function crear(CategoriaDTO $dto)
    {
        return $this->categoriaRepository->crear($dto);
    }

    public function actualizar(int $id, CategoriaDTO $dto)
    {
        return $this->categoriaRepository->actualizar($id, $dto);
    }

    public function eliminar(int $id)
    {
        return $this->categoriaRepository->eliminar($id);
    }
}
