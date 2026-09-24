<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SolicitacaoController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validação dos dados que chegam do Frontend
        $validated = $request->validate([
            'nome_solicitante' => 'required|string|max:255',
            'categoria' => 'required|in:CONSULTA,EXAME,VACINACAO,OUTRO',
            'prioridade' => 'required|in:BAIXA,MEDIA,ALTA,URGENTE',
            'descricao' => 'required|string',
            // A regra "required_if" garante que a justificativa seja exigida apenas se for urgente
            'justificativa_prioridade' => 'required_if:prioridade,URGENTE',
        ]);

        // 2. Regra de Negócio: Geração automática de protocolo único
        $validated['protocolo'] = strtoupper(Str::random(10));
        
        // O status 'RECEBIDA' e a data de criação já são preenchidos automaticamente pelo Banco e pelo Modelo

        // 3. Salva no banco de dados
        $solicitacao = Solicitacao::create($validated);

        // 4. Retorna os dados criados com o código HTTP 201 (Created)
        return response()->json($solicitacao, 201);
    }
}