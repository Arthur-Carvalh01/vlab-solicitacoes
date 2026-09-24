<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SolicitacaoController;

// Rota POST /api/v1/solicitacoes exigida pelo desafio
Route::post('/v1/solicitacoes', [SolicitacaoController::class, 'store']);