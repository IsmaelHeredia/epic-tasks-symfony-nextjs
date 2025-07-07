<?php

namespace App\Repository;

use App\Entity\Categoria;
use App\DTO\CategoriaReporteDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class EstadisticasRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Categoria::class);
    }

    public function generarReporte(): array
    {
        $qb = $this->createQueryBuilder('c');

        $qb->select('c.nombre as nombreCategoria')
           ->addSelect('COUNT(DISTINCT t.id) + COUNT(DISTINCT st.id) as totalTareasSubtareas');

        $qb->leftJoin('c.tareas', 't')
           ->leftJoin('c.subtareas', 'st');

        $qb->groupBy('c.nombre');

        $qb->orderBy('totalTareasSubtareas', 'DESC');

        $qb->setMaxResults(5);

        $resultados = $qb->getQuery()->getResult();

        $reporteDTOs = [];
        foreach ($resultados as $resultado) {
            $reporteDTOs[] = new CategoriaReporteDTO(
                $resultado['nombreCategoria'],
                (int) $resultado['totalTareasSubtareas']
            );
        }

        return $reporteDTOs;
    }
}