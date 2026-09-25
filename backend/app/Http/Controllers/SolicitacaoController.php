<?php

namespace App\Http\Controllers;

use App\Models\Solicitacao;
use App\Services\SolicitacaoService;
use App\Http\Requests\StoreSolicitacaoRequest;
use App\Http\Requests\UpdateStatusSolicitacaoRequest;
use Illuminate\Http\Request;
use Exception;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="API V-Lab - Gestão de Solicitações",
 *     description="Documentação técnica interativa dos endpoints REST do desafio V-Lab."
 * )
 */
class SolicitacaoController extends Controller
{
    protected $solicitacaoService;

    // Injeção de dependência do Serviço
    public function __construct(SolicitacaoService $solicitacaoService)
    {
        $this->solicitacaoService = $solicitacaoService;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/solicitacoes",
     *     summary="Lista e filtra as solicitações",
     *     tags={"Solicitações"},
     *     @OA\Parameter(name="status", in="query", description="Filtrar por status", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="categoria", in="query", description="Filtrar por categoria", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="prioridade", in="query", description="Filtrar por prioridade", required=false, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Lista paginada de solicitações")
     * )
     */
    public function index(Request $request)
    {
        $query = Solicitacao::query();

        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('categoria')) $query->where('categoria', $request->categoria);
        if ($request->has('prioridade')) $query->where('prioridade', $request->prioridade);

        return response()->json($query->paginate(10));
    }

    /**
     * @OA\Post(
     *     path="/api/v1/solicitacoes",
     *     summary="Cria uma nova solicitação",
     *     tags={"Solicitações"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nome_solicitante","categoria","prioridade","descricao"},
     *             @OA\Property(property="nome_solicitante", type="string", example="Paciente Teste"),
     *             @OA\Property(property="categoria", type="string", example="CONSULTA"),
     *             @OA\Property(property="prioridade", type="string", example="URGENTE"),
     *             @OA\Property(property="descricao", type="string", example="Avaliação cardiológica necessária."),
     *             @OA\Property(property="justificativa_prioridade", type="string", example="Risco elevado. Necessidade imediata.")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Solicitação criada com sucesso"),
     *     @OA\Response(response=422, description="Erro de validação (ex: justificativa ausente para prioridade URGENTE)")
     * )
     */
    public function store(StoreSolicitacaoRequest $request) 
    {
        $solicitacao = $this->solicitacaoService->criarSolicitacao($request->validated());
        
        return response()->json($solicitacao, 201);
    }

    /**
     * @OA\Patch(
     *     path="/api/v1/solicitacoes/{id}/status",
     *     summary="Atualiza o status de uma solicitação",
     *     tags={"Solicitações"},
     *     @OA\Parameter(name="id", in="path", required=true, description="ID numérico da solicitação", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", example="EM_ANALISE")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Status atualizado com sucesso"),
     *     @OA\Response(response=422, description="Transição de status inválida pela máquina de estados")
     * )
     */
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
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}