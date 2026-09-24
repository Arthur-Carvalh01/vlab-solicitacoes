<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solicitacao extends Model
{
    // Ensina ao Laravel o nome correto da tabela em português
    protected $table = 'solicitacoes';

    const CREATED_AT = 'data_criacao';
    const UPDATED_AT = 'data_atualizacao';

    protected $fillable = [
        'protocolo',
        'nome_solicitante',
        'categoria',
        'prioridade',
        'status',
        'descricao',
        'justificativa_prioridade',
    ];
}