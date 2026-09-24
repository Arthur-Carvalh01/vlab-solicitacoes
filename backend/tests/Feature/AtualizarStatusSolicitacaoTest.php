<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Solicitacao;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AtualizarStatusSolicitacaoTest extends TestCase
{
    // A trait RefreshDatabase garante que o banco de dados é limpo a cada execução do teste
    use RefreshDatabase;

    public function test_deve_bloquear_transicao_invalida_de_status()
    {
        // 1. Preparação (Cria uma solicitação no banco de teste com status inicial)
        $solicitacao = Solicitacao::create([
            'protocolo' => 'TESTE12345',
            'nome_solicitante' => 'Maria Silva',
            'categoria' => 'CONSULTA',
            'prioridade' => 'BAIXA',
            'status' => 'RECEBIDA',
            'descricao' => 'Teste de bloqueio de status',
        ]);

        // 2. Ação (Tenta saltar de RECEBIDA direto para CONCLUIDA através da API)
        $response = $this->patchJson("/api/v1/solicitacoes/{$solicitacao->id}/status", [
            'status' => 'CONCLUIDA'
        ]);

        // 3. Verificação (A API deve devolver o erro 422 Unprocessable Entity e a mensagem correta)
        $response->assertStatus(422);
        
        // Verifica se a mensagem de erro do Service está a ser devolvida corretamente na resposta
        $response->assertJsonFragment([
            'message' => 'Transição inválida. Não é possível mudar o status de RECEBIDA para CONCLUIDA.'
        ]);
    }
}