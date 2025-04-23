<?php

namespace App\Service;

use App\DTO\PrioridadDTO;
use App\Repository\PrioridadRepository;
use Doctrine\ORM\EntityManagerInterface;

class PrioridadService
{
    public function __construct(
        private PrioridadRepository $prioridadRepository,
        private EntityManagerInterface $em
    ) {}

    public function listar()
    {
        return $this->prioridadRepository->listar();
    }

    public function obtener(int $id)
    {
        return $this->prioridadRepository->obtener($id);
    }

    public function crear(PrioridadDTO $dto)
    {
        return $this->prioridadRepository->crear($dto);
    }

    public function actualizar(int $id, PrioridadDTO $dto)
    {
        return $this->prioridadRepository->actualizar($id, $dto);
    }

    public function eliminar(int $id)
    {
        return $this->prioridadRepository->eliminar($id);
    }
}