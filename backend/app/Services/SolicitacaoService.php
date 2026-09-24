<?php

namespace App\Services;

use App\Models\Solicitacao;
use Illuminate\Support\Str;
use Exception;

class SolicitacaoService
{
    public function criarSolicitacao(array $dados)
    {
        $dados['protocolo'] = strtoupper(Str::random(10));
        return Solicitacao::create($dados);
    }

    public function atualizarStatus(Solicitacao $solicitacao, string $novoStatus)
    {
        $statusAtual = $solicitacao->status;
        
        $transicoesValidas = [
            'RECEBIDA' => ['EM_ANALISE', 'CANCELADA'],
            'EM_ANALISE' => ['AGENDADA', 'CANCELADA'],
            'AGENDADA' => ['CONCLUIDA', 'CANCELADA'],
            'CONCLUIDA' => [],
            'CANCELADA' => [],
        ];

        if (!in_array($novoStatus, $transicoesValidas[$statusAtual])) {
            throw new Exception("Transição inválida. Não é possível mudar o status de {$statusAtual} para {$novoStatus}.");
        }

        $solicitacao->status = $novoStatus;
        $solicitacao->save();

        return $solicitacao;
    }
}