<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use App\Services\SolicitacaoService;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Requests\UpdateStatusSolicitacaoRequest;
use Illuminate\Http\Request;
use Exception;

class SolicitacaoController extends Controller
{
    protected $solicitacaoService;

    // Injeção de dependência do Serviço
    public function __construct(SolicitacaoService $solicitacaoService)
    {
        $this->solicitacaoService = $solicitacaoService;
    }

    public function index(Request $request)
    {
        $query = Solicitacao::query();

        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('categoria')) $query->where('categoria', $request->categoria);
        if ($request->has('prioridade')) $query->where('prioridade', $request->prioridade);

        return response()->json($query->paginate(10));
    }

    // Usa o StoreSolicitacaoRequest no lugar de Request
    public function store(StoreSolicitacaoRequest $request) 
    {
        // $request->validated() já traz apenas os dados seguros e validados
        $solicitacao = $this->solicitacaoService->criarSolicitacao($request->validated());
        
        return response()->json($solicitacao, 201);
    }

    // Usa o UpdateStatusSolicitacaoRequest
    public function updateStatus(UpdateStatusSolicitacaoRequest $request, $id)
    {
        try {
            $solicitacao = Solicitacao::findOrFail($id);
            
            $atualizada = $this->solicitacaoService->atualizarStatus(
                $solicitacao, 
                $request->validated('status')
            );
            
            return response()->json($atualizada);
        } catch (Exception $e) {
            // Retorna a exceção gerada no Service com código 422 (Unprocessable Entity)
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}