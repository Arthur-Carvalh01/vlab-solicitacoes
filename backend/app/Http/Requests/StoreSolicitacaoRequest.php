<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSolicitacaoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Retorne true se não houver lógica de permissão de usuário
    }

    public function rules(): array
    {
        return [
            'nome_solicitante' => 'required|string|max:255',
            'categoria' => 'required|in:CONSULTA,EXAME,VACINACAO,OUTRO',
            'prioridade' => 'required|in:BAIXA,MEDIA,ALTA,URGENTE',
            'descricao' => 'required|string',
            'justificativa_prioridade' => 'required_if:prioridade,URGENTE',
        ];
    }
}