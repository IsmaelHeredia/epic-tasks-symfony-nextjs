<?php

namespace App\DTO;

class CategoriaReporteDTO
{
    public string $nombreCategoria;
    public int $totalTareasSubtareas;

    public function __construct(string $nombreCategoria, int $totalTareasSubtareas)
    {
        $this->nombreCategoria = $nombreCategoria;
        $this->totalTareasSubtareas = $totalTareasSubtareas;
    }
}