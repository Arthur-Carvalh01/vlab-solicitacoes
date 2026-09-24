<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SolicitacaoController extends Controller
{
    public function index(Request $request)
    {
        $query = Solicitacao::query();

        // Aplica os filtros solicitados pelo edital, se forem enviados na URL
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('categoria')) {
            $query->where('categoria', $request->categoria);
        }
        if ($request->has('prioridade')) {
            $query->where('prioridade', $request->prioridade);
        }

        // Retorna os dados com paginação (ex: 10 itens por página)
        $solicitacoes = $query->paginate(10);

        return response()->json($solicitacoes);
    }

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

    public function updateStatus(Request $request, $id)
    {
        $solicitacao = Solicitacao::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:EM_ANALISE,AGENDADA,CONCLUIDA,CANCELADA',
        ]);

        $statusAtual = $solicitacao->status;
        $novoStatus = $validated['status'];

        // Regras de transição exigidas pelo edital
        $transicoesValidas = [
            'RECEBIDA' => ['EM_ANALISE', 'CANCELADA'],
            'EM_ANALISE' => ['AGENDADA', 'CANCELADA'],
            'AGENDADA' => ['CONCLUIDA', 'CANCELADA'],
            'CONCLUIDA' => [],
            'CANCELADA' => [],
        ];

        // Verifica se o movimento é permitido
        if (!in_array($novoStatus, $transicoesValidas[$statusAtual])) {
            return response()->json([
                'message' => "Transição inválida. Não é possível mudar o status de {$statusAtual} para {$novoStatus}."
            ], 422);
        }

        $solicitacao->status = $novoStatus;
        $solicitacao->save();

        return response()->json($solicitacao);
    }
}