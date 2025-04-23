<?php

namespace App\Controller;

use App\DTO\TareaDTO;
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
    #[OA\Get(summary: 'Listar todas las tareas')]
    public function listar(): JsonResponse
    {
        $tareas = $this->tareaService->listar();
        return $this->json(['mensaje' => 'Tareas listadas correctamente', 'tareas' => $tareas], Response::HTTP_OK);
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

        $dtoValidator->validate($dto);

        $tarea = $this->tareaService->actualizar($id, $dto);

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

        return $this->json(['mensaje' => 'Tarea eliminada'], Response::HTTP_OK);
    }
}