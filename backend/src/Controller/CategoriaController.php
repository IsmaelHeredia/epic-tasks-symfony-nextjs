<?php

namespace App\Controller;

use App\DTO\CategoriaDTO;
use App\Service\CategoriaService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use OpenApi\Attributes as OA;
use App\Utils\DtoValidator;

#[Route('/api/categorias')]
class CategoriaController extends AbstractController
{
    public function __construct(private readonly CategoriaService $categoriaService)
    {
    }

    #[Route('/', name: 'listar_categorias', methods: ['GET'])]
    #[OA\Get(summary: 'Listar todas las categorias')]
    public function listar(): JsonResponse
    {
        $categorias = $this->categoriaService->listar();
        return $this->json(['mensaje' => 'Categorias listadas correctamente', 'categorias' => $categorias], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'obtener_categoria', methods: ['GET'])]
    #[OA\Get(summary: 'Obtener una categoria por ID')]
    public function obtener(int $id): JsonResponse
    {
        $categoria = $this->categoriaService->obtener($id);

        if (!$categoria) {
            return $this->json(['mensaje' => 'Categoría no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Categoria cargada correctamente', 'categoria' => $categoria], Response::HTTP_OK);
    }

    #[Route('/', name: 'crear_categoria', methods: ['POST'])]
    #[OA\Post(summary: 'Crear una nueva categoria')]
    public function crear(Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new CategoriaDTO($data['nombre'] ?? null);

        $dtoValidator->validate($dto);

        $categoria = $this->categoriaService->crear($dto);

        return $this->json(['mensaje' => 'Categoria creada correctamente', 'categoria' => $categoria], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'actualizar_categoria', methods: ['PUT'])]
    #[OA\Put(summary: 'Actualizar una categoria existente')]
    public function actualizar(int $id, Request $request, DtoValidator $dtoValidator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new CategoriaDTO($data['nombre'] ?? null);

        $dtoValidator->validate($dto);

        $categoria = $this->categoriaService->actualizar($id, $dto);

        if (!$categoria) {
            return $this->json(['mensaje' => 'Categoría no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(['mensaje' => 'Categoria actualizada con éxito', 'categoria' => $categoria], Response::HTTP_OK);
    }

    #[Route('/{id}', name: 'eliminar_categoria', methods: ['DELETE'])]
    #[OA\Delete(summary: 'Eliminar una categoria existente')]
    public function eliminar(int $id): JsonResponse
    {
        $eliminado = $this->categoriaService->eliminar($id);

        if (!$eliminado) {
            return $this->json(['mensaje' => 'Categoría no encontrada'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
