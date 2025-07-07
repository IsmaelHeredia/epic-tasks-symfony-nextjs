<?php

namespace App\Service;

use App\Repository\EstadisticasRepository;

class EstadisticasService
{
    public function __construct(
        private readonly EstadisticasRepository $estadisticasRepository
    ) {}

    public function generarReporte()
    {
        return $this->estadisticasRepository->generarReporte();
    }
}
