<?php

namespace App\Repository;

use App\Entity\Tarea;
use App\Entity\Subtarea;
use App\Entity\Categoria;
use App\DTO\TareaDTO;
use App\DTO\SubtareaDTO;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\EstadoRepository;
use App\Repository\PrioridadRepository;
use App\Serializer\TareaSerializer;
use Doctrine\ORM\Tools\Pagination\Paginator;

class TareaRepository extends ServiceEntityRepository
{
    private EstadoRepository $estadoRepository;
    private PrioridadRepository $prioridadRepository;

    public function __construct(
        ManagerRegistry $registry,
        EstadoRepository $estadoRepository,
        PrioridadRepository $prioridadRepository
    ) {
        parent::__construct($registry, Tarea::class);
        $this->estadoRepository = $estadoRepository;
        $this->prioridadRepository = $prioridadRepository;
    }

    public function findAllTareas(): array
    {
        $qb = $this->createQueryBuilder('t')
            ->select('t.id', 't.titulo', 't.orden')
            ->orderBy('t.orden', 'ASC');

        $tareas = $qb->getQuery()->getArrayResult();

        return [
            'tareas' => $tareas,
            'totalCount' => count($tareas),
        ];
    }

    public function findTareasByCriteria(?string $titulo, ?array $categoriaIds, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;

        $qb = $this->createQueryBuilder('t')
            ->orderBy('t.orden', 'ASC');

        if ($titulo) {
            $qb->andWhere($qb->expr()->like('t.titulo', ':titulo'))
                ->setParameter('titulo', '%' . $titulo . '%');
        }

        if (!empty($categoriaIds)) {
            $qb->join('t.categorias', 'c')
                ->andWhere($qb->expr()->in('c.id', ':categoriaIds'))
                ->setParameter('categoriaIds', $categoriaIds);
        }

        $totalCountQb = clone $qb;
        $totalCountQb->select('count(t.id)')
            ->resetDQLPart('orderBy')
            ->distinct(true);

        $totalCount = $totalCountQb->getQuery()->getSingleScalarResult();

        $qb->setFirstResult($offset)
            ->setMaxResults($limit);

        $tareas = $qb->getQuery()->getResult();

        return [
            'tareas' => $tareas,
            'totalCount' => (int) $totalCount,
        ];
    }

    public function obtener(int $id)
    {
        $tarea = $this->find($id);
        return $tarea ? TareaSerializer::serialize($tarea) : null;
    }

    public function findMaxOrden()
    {
        return $this->createQueryBuilder('t')
            ->select('MAX(t.orden)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function crear(TareaDTO $dto)
    {
        $tarea = new Tarea();
        $tarea->setTitulo($dto->titulo)
            ->setContenido($dto->contenido)
            ->setCreatedAt(new \DateTimeImmutable())
            ->setUpdatedAt(new \DateTimeImmutable());

        $ultimoOrden = $this->findMaxOrden();
        $nuevoOrden = ($ultimoOrden === null) ? 1 : $ultimoOrden + 1;
        $tarea->setOrden($nuevoOrden);

        $this->asignarEstadoYPrioridad($tarea, $dto);
        $this->asignarCategorias($tarea, $dto->categoriasId);
        $this->asignarSubtareas($tarea, $dto->subtareas);

        $em = $this->getEntityManager();
        $em->persist($tarea);
        $em->flush();

        return TareaSerializer::serialize($tarea);
    }

    public function actualizar(int $id, TareaDTO $dto)
    {
        $tarea = $this->find($id);

        if (!$tarea) {
            return null;
        }

        $tarea->setTitulo($dto->titulo)
            ->setContenido($dto->contenido)
            ->setOrden($dto->orden)
            ->setUpdatedAt(new \DateTimeImmutable());

        $this->asignarEstadoYPrioridad($tarea, $dto);
        $this->asignarCategorias($tarea, $dto->categoriasId);

        foreach ($tarea->getSubtareas() as $sub) {
            $tarea->removeSubtarea($sub);
        }

        $this->asignarSubtareas($tarea, $dto->subtareas);

        $this->getEntityManager()->flush();

        return TareaSerializer::serialize($tarea);
    }

    public function cambiarOrden(int $id, TareaDTO $dto)
    {
        $tarea = $this->find($id);

        if (!$tarea) {
            return null;
        }

        $tarea->setOrden($dto->orden)
            ->setUpdatedAt(new \DateTimeImmutable());

        $this->getEntityManager()->flush();

        return TareaSerializer::serialize($tarea);
    }

    public function ordenarTareas(array $tasksData): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->beginTransaction();

        try {
            $taskIds = array_column($tasksData, 'id');

            $tareasList = $this->createQueryBuilder('t')
                ->where('t.id IN (:ids)')
                ->setParameter('ids', $taskIds)
                ->getQuery()
                ->getResult();

            $tareasIndexed = [];
            foreach ($tareasList as $tarea) {
                $tareasIndexed[$tarea->getId()] = $tarea;
            }

            foreach ($tasksData as $taskData) {
                $id = $taskData['id'];
                $orden = $taskData['orden'];

                if (!isset($tareasIndexed[$id])) {
                    throw new \Exception(sprintf('Tarea con ID %d no encontrada para actualizar el orden', $id));
                }

                $tarea = $tareasIndexed[$id];
                $tarea->setOrden($orden);
            }

            $entityManager->flush();
            $entityManager->commit();
        } catch (\Exception $e) {
            $entityManager->rollback();
            throw $e;
        }
    }

    public function eliminar(int $id): bool
    {
        $tarea = $this->find($id);

        if (!$tarea) {
            return false;
        }

        $this->getEntityManager()->remove($tarea);
        $this->getEntityManager()->flush();
        return true;
    }

    private function asignarEstadoYPrioridad(Tarea $tarea, TareaDTO $dto): void
    {
        $estado = $dto->estadoId ? $this->estadoRepository->find($dto->estadoId) : null;
        $prioridad = $dto->prioridadId ? $this->prioridadRepository->find($dto->prioridadId) : null;
        $tarea->setEstado($estado);
        $tarea->setPrioridad($prioridad);
    }

    private function asignarCategorias(Tarea $tarea, array $categoriasId): void
    {
        $categoriaRepo = $this->getEntityManager()->getRepository(Categoria::class);
        $tarea->getCategorias()->clear();

        foreach ($categoriasId as $categoriaId) {
            $categoria = $categoriaRepo->find($categoriaId);
            if ($categoria) {
                $tarea->addCategoria($categoria);
            }
        }
    }

    private function asignarSubtareas(Tarea $tarea, array $subtareaDTOs): void
    {
        $categoriaRepo = $this->getEntityManager()->getRepository(Categoria::class);

        foreach ($subtareaDTOs as $subDTO) {
            $sub = new Subtarea();
            $sub->setTitulo($subDTO->titulo)
                ->setContenido($subDTO->contenido)
                ->setOrden($subDTO->orden)
                ->setCreatedAt(new \DateTimeImmutable())
                ->setUpdatedAt(new \DateTimeImmutable());

            $estado = $this->estadoRepository->find($subDTO->estadoId);
            $prioridad = $this->prioridadRepository->find($subDTO->prioridadId);

            if (!$estado) {
                throw new \RuntimeException("Estado con ID {$subDTO->estadoId} no encontrado para subtarea");
            }

            if (!$prioridad) {
                throw new \RuntimeException("Prioridad con ID {$subDTO->prioridadId} no encontrada para subtarea");
            }

            $sub->setEstado($estado);
            $sub->setPrioridad($prioridad);
            $sub->setTarea($tarea);

            foreach ($subDTO->categoriasId as $catId) {
                $categoria = $categoriaRepo->find($catId);
                if ($categoria) {
                    $sub->addCategoria($categoria);
                } else {
                    throw new \RuntimeException("Categoría con ID {$catId} no encontrada para subtarea");
                }
            }

            $tarea->addSubtarea($sub);
        }
    }

}
