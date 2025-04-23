<?php

namespace App\Entity;

use App\Repository\CategoriaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoriaRepository::class)]
class Categoria
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nombre = null;

    #[ORM\ManyToMany(targetEntity: Tarea::class, mappedBy: 'categorias')]
    private Collection $tareas;

    #[ORM\ManyToMany(targetEntity: Subtarea::class, mappedBy: 'categorias')]
    private Collection $subtareas;

    public function __construct()
    {
        $this->tareas = new ArrayCollection();
        $this->subtareas = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): ?string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getTareas(): Collection
    {
        return $this->tareas;
    }

    public function addTarea(Tarea $tarea): static
    {
        if (!$this->tareas->contains($tarea)) {
            $this->tareas->add($tarea);
            $tarea->addCategoria($this);
        }

        return $this;
    }

    public function removeTarea(Tarea $tarea): static
    {
        if ($this->tareas->removeElement($tarea)) {
            $tarea->removeCategoria($this);
        }

        return $this;
    }

    public function getSubtareas(): Collection
    {
        return $this->subtareas;
    }

    public function addSubtarea(Subtarea $subtarea): static
    {
        if (!$this->subtareas->contains($subtarea)) {
            $this->subtareas->add($subtarea);
            $subtarea->addCategoria($this);
        }

        return $this;
    }

    public function removeSubtarea(Subtarea $subtarea): static
    {
        if ($this->subtareas->removeElement($subtarea)) {
            $subtarea->removeCategoria($this);
        }

        return $this;
    }
}
