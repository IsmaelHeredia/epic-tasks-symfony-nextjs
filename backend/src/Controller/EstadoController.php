<?php

namespace App\Controller;

use App\DTO\EstadoDTO;
use App\Service\EstadoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Attributes as OA;
use App\Utils\DtoValidator;

#[Route('/api/estados')]
class EstadoController extends AbstractController
{
    public function __construct(
        private EstadoService $estadoService,
        private SerializerInterface $serializer
    ) {}

    #[Route('/', name: 'listar_estados', methods: ['GET'])]
    #[OA\Get(summary: 'Listar todas los estados')]
    public function listar(): JsonResponse
    {
        $estados = $this->estadoService->listar();
        return $this->json(['mensaje' => 'Estados listados correctamente', 'estados' => $estados], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'obtener_estado', methods: ['GET'])]
    #[OA\Get(summary: 'Obtener un estado por ID')]
    public function obtener(int $id): JsonResponse
    {
        $estado = $this->estadoService->obtener($id);

        if (!$estado) {
            return $this->json(['error' => 'Estado no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Estado cargado correctamente', 'estado' => $estado], Response::HTTP_OK);
    }

    #[Route('/', name: 'crear_estado', methods: ['POST'])]
    #[OA\Post(summary: 'Crear un nuevo estado')]
    public function crear(Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new EstadoDTO($data['nombre'] ?? null);

        $dtoValidator->validate($dto);

        $estado = $this->estadoService->crear($dto);
        
        return $this->json(['mensaje' => 'Estado creado correctamente', 'estado' => $estado], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'actualizar_estado', methods: ['PUT'])]
    #[OA\Put(summary: 'Actualizar un estado existente')]
    public function actualizar(int $id, Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new EstadoDTO($data['nombre'] ?? null);

        $dtoValidator->validate($dto);

        $estado = $this->estadoService->actualizar($id, $dto);

        if (!$estado) {
            return $this->json(['mensaje' => 'Estado no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Estado actualizado con éxito', 'estado' => $estado], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'eliminar_estado', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Eliminar un estado existente')]
    public function eliminar(int $id): JsonResponse
    {
        $exito = $this->estadoService->eliminar($id);

        if (!$exito) {
            return $this->json(['error' => 'Estado no encontrado'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Estado eliminado con éxito'], Response::HTTP_OK);
    }
}
