<?php

namespace App\Controller;

use App\DTO\UsuarioLoginDTO;
use App\DTO\UsuarioUpdateCuentaDTO;
use App\Service\UsuarioService;
use App\Utils\DtoValidator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;

#[Route('/api/usuario')]
class UsuarioController extends AbstractController
{
    public function __construct(
        private UsuarioService $usuarioService,
        private DtoValidator $dtoValidator,
    ) {}

    #[Route('/login', name: 'usuario_login', methods: ['POST'])]
    #[OA\Post(summary: 'Iniciar sesión')]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new UsuarioLoginDTO();
        $dto->nombre = $data['nombre'] ?? null;
        $dto->clave = $data['clave'] ?? null;

        $this->dtoValidator->validate($dto);

        $result = $this->usuarioService->login($dto);

        if (!$result) {
            return $this->json(['error' => 'Credenciales inválidas.'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json($result, Response::HTTP_OK);
    }

    #[Route('/actualizar-cuenta', name: 'usuario_actualizar_cuenta', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    #[OA\Post(summary: 'Actualizar datos de usuario')]
    public function actualizarCuenta(Request $request): JsonResponse
    {
        $usuario = $this->getUser();

        $dto = new UsuarioUpdateCuentaDTO();
        $dto->nombre = $request->request->get('nombre');
        $dto->clave = $request->request->get('clave');
        $dto->imagen = $request->files->get('imagen');
        $dto->currentPassword = $request->request->get('currentPassword');

        $this->dtoValidator->validate($dto);

        try {
            $this->usuarioService->actualizarCuenta($usuario, $dto);
            return $this->json(['mensaje' => 'Cuenta actualizada con éxito.'], Response::HTTP_OK);
        } catch (BadCredentialsException $e) {
            return $this->json(['mensaje' => $e->getMessage()], Response::HTTP_UNAUTHORIZED);
        } catch (\Exception $e) {
            return $this->json(['mensaje' => 'Error al actualizar la cuenta: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}