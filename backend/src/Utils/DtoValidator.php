<?php

namespace App\Utils;

use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class DtoValidator
{
    public function __construct(private ValidatorInterface $validator) {}

    public function validate(object $dto): void
    {
        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            $mensajes = [];
            foreach ($errors as $error) {
                $mensajes[] = $error->getPropertyPath() . ': ' . $error->getMessage();
            }
            throw new BadRequestHttpException(implode(' | ', $mensajes));
        }
    }
}