<?php

namespace App\Service;

use App\DTO\UsuarioLoginDTO;
use App\DTO\UsuarioUpdateCuentaDTO;
use App\Entity\Usuario;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class UsuarioService
{
    public function __construct(
        private UsuarioRepository $usuarioRepository,
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager,
        private string $imagenesUsuariosDir
    ) {}

    public function login(UsuarioLoginDTO $dto)
    {
        $usuario = $this->usuarioRepository->findOneBy(['nombre' => $dto->nombre]);

        if (!$usuario || !$this->passwordHasher->isPasswordValid($usuario, $dto->clave)) {
            return null;
        }

        $token = $this->jwtManager->create($usuario);

        return [
            'token' => $token,
            'usuario' => [
                'id' => $usuario->getId(),
                'nombre' => $usuario->getNombre(),
                'imagen' => $usuario->getImagen(),
                'roles' => $usuario->getRoles()
            ]
        ];
    }

    public function actualizarCuenta(Usuario $usuario, UsuarioUpdateCuentaDTO $dto)
    {
        if ($dto->nombre) {
            $usuario->setNombre($dto->nombre);
        }
    
        if ($dto->clave) {
            $usuario->setClave($this->passwordHasher->hashPassword($usuario, $dto->clave));
        }
    
        if ($dto->imagen instanceof UploadedFile) {
            $imagenAnterior = $usuario->getImagen();
            if ($imagenAnterior) {
                $rutaAnterior = $this->imagenesUsuariosDir . '/' . $imagenAnterior;
                if (file_exists($rutaAnterior)) {
                    unlink($rutaAnterior);
                }
            }
    
            $nuevoNombre = uniqid().'.'.$dto->imagen->guessExtension();
            $dto->imagen->move($this->imagenesUsuariosDir, $nuevoNombre);
            $usuario->setImagen($nuevoNombre);
        }
    
        $usuario->setUpdatedAt(new \DateTimeImmutable());
        $this->em->flush();
    }
}
