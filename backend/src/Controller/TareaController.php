<?php

namespace App\Controller;

use App\DTO\TareaDTO;
use App\DTO\SubtareaDTO;
use App\Service\TareaService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Attributes as OA;
use App\Utils\DtoValidator;

#[Route('/api/tareas')]
class TareaController extends AbstractController
{
    public function __construct(private TareaService $tareaService) {}

    #[Route('', methods: ['GET'])]
    #[OA\Get(summary: 'Listar todas las tareas con filtros, orden y paginación')]
    public function listar(Request $request): JsonResponse
    {
        $titulo = $request->query->get('titulo');
        $categorias = $request->query->get('categorias');
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);

        $categoriaIds = null;

        if (is_array($categorias)) {
            $categoriaIds = array_map('intval', $categorias);
        } elseif (is_string($categorias) && $categorias !== '') {
            $categoriaIds = array_map('intval', explode(',', $categorias));
        }

        $result = $this->tareaService->listar($titulo, $categoriaIds, $page, $limit);

        return $this->json([
            'mensaje' => 'Tareas listadas correctamente',
            'tareas' => $result['tareas'],
            'currentPage' => $result['currentPage'],
            'perPage' => $result['perPage'],
            'totalPages' => $result['totalPages'],
            'totalCount' => $result['totalCount'],
        ], Response::HTTP_OK);
    }

    #[Route('/{id}', methods: ['GET'])]
    #[OA\Get(summary: 'Obtener una tarea por ID')]
    public function obtener(int $id): JsonResponse
    {
        $tarea = $this->tareaService->obtener($id);

        if (!$tarea) {
            return $this->json(['mensaje' => 'Tarea no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($tarea);
    }

    #[Route('', methods: ['POST'])]
    #[OA\Post(summary: 'Crear una nueva tarea')]
    public function crear(Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new TareaDTO();
        $dto->titulo = $data['titulo'] ?? null;
        $dto->contenido = $data['contenido'] ?? null;
        $dto->orden = $data['orden'] ?? null;
        $dto->estadoId = $data['estadoId'] ?? null;
        $dto->prioridadId = $data['prioridadId'] ?? null;
        $dto->categoriasId = $data['categoriasId'] ?? [];

        $dto->subtareas = [];
        if (isset($data['subtareas']) && is_array($data['subtareas'])) {
            foreach ($data['subtareas'] as $rawSubtarea) {
                $subtareaDTO = new SubtareaDTO();
                $subtareaDTO->titulo = $rawSubtarea['titulo'] ?? null;
                $subtareaDTO->contenido = $rawSubtarea['contenido'] ?? null;
                $subtareaDTO->orden = $rawSubtarea['orden'] ?? null;
                $subtareaDTO->estadoId = $rawSubtarea['estadoId'] ?? null;
                $subtareaDTO->prioridadId = $rawSubtarea['prioridadId'] ?? null;
                $subtareaDTO->categoriasId = $rawSubtarea['categoriasId'] ?? [];

                $dto->subtareas[] = $subtareaDTO;
            }
        }

        $dtoValidator->validate($dto);

        $tarea = $this->tareaService->crear($dto);

        return $this->json(['mensaje' => 'Tarea creada correctamente', 'tarea' => $tarea], Response::HTTP_CREATED);
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[OA\Put(summary: 'Actualizar una tarea existente')]
    public function actualizar(int $id, Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new TareaDTO();
        $dto->titulo = $data['titulo'] ?? null;
        $dto->contenido = $data['contenido'] ?? null;
        $dto->orden = $data['orden'] ?? null;
        $dto->estadoId = $data['estadoId'] ?? null;
        $dto->prioridadId = $data['prioridadId'] ?? null;
        $dto->categoriasId = $data['categoriasId'] ?? [];

        $dto->subtareas = [];

        if (isset($data['subtareas']) && is_array($data['subtareas'])) {
            foreach ($data['subtareas'] as $rawSubtarea) {
                $subtareaDTO = new SubtareaDTO();
                $subtareaDTO->id = $rawSubtarea['id'] ?? null;
                $subtareaDTO->titulo = $rawSubtarea['titulo'] ?? null;
                $subtareaDTO->contenido = $rawSubtarea['contenido'] ?? null;
                $subtareaDTO->orden = $rawSubtarea['orden'] ?? null;
                $subtareaDTO->estadoId = $rawSubtarea['estadoId'] ?? null;
                $subtareaDTO->prioridadId = $rawSubtarea['prioridadId'] ?? null;
                $subtareaDTO->categoriasId = $rawSubtarea['categoriasId'] ?? [];

                $dto->subtareas[] = $subtareaDTO;
            }
        }

        $dtoValidator->validate($dto);

        $tarea = $this->tareaService->actualizar($id, $dto);

        if (!$tarea) {
            return $this->json(['error' => 'Tarea no encontrada'], 404);
        }

        return $this->json(['mensaje' => 'Tarea actualizada con éxito', 'tarea' => $tarea], Response::HTTP_OK);
    }

    #[Route('/{id}/cambiarOrden', methods: ['PUT'])]
    #[OA\Put(summary: 'Actualizar una tarea existente')]
    public function cambiarOrden(int $id, Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new TareaDTO();
        $dto->orden = $data['orden'] ?? null;

        $tarea = $this->tareaService->cambiarOrden($id, $dto);

        if (!$tarea) {
            return $this->json(['error' => 'Tarea no encontrada'], 404);
        }

        return $this->json(['mensaje' => 'Tarea actualizada con éxito', 'tarea' => $tarea], Response::HTTP_OK);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Eliminar una tarea existente')]
    public function eliminar(int $id): JsonResponse
    {
        $eliminado = $this->tareaService->eliminar($id);

        if (!$eliminado) {
            return $this->json(['mensaje' => 'Tarea no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}