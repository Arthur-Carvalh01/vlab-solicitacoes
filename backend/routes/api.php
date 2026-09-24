<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SolicitacaoController;

// Rota GET /api/v1/solicitacoes para listagem e filtros
Route::get('/v1/solicitacoes', [SolicitacaoController::class, 'index']);

// Rota POST /api/v1/solicitacoes exigida pelo desafio
Route::post('/v1/solicitacoes', [SolicitacaoController::class, 'store']);

// Rota PATCH para atualizar o status
Route::patch('/v1/solicitacoes/{id}/status', [SolicitacaoController::class, 'updateStatus']);