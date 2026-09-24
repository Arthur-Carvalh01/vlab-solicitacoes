export interface Solicitacao {
    id: number;
    protocolo: string;
    nome_solicitante: string;
    categoria: 'CONSULTA' | 'EXAME' | 'VACINACAO' | 'OUTRO';
    prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    status: 'RECEBIDA' | 'EM_ANALISE' | 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
    descricao: string;
    justificativa_prioridade?: string | null;
    data_criacao: string;
    data_atualizacao: string;
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    total: number;
    last_page: number;
}