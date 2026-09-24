<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solicitacoes', function (Blueprint $table) {
            $table->id();
            $table->string('protocolo')->unique(); 
            $table->string('nome_solicitante');
            
            // Limitando as opções conforme as regras de negócio
            $table->enum('categoria', ['CONSULTA', 'EXAME', 'VACINACAO', 'OUTRO']);
            $table->enum('prioridade', ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']);
            $table->enum('status', ['RECEBIDA', 'EM_ANALISE', 'AGENDADA', 'CONCLUIDA', 'CANCELADA'])
                  ->default('RECEBIDA'); 
                  
            $table->text('descricao');
            $table->text('justificativa_prioridade')->nullable(); 

            // Colunas de data personalizadas exigidas pelo documento
            $table->timestamp('data_criacao')->nullable();
            $table->timestamp('data_atualizacao')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitacoes');
    }
};
