import { useEffect, useState } from 'react';
import { api } from './services/api';
import type { Solicitacao, PaginatedResponse } from './types';
import NovaSolicitacaoDialog from './components/NovaSolicitacaoDialog';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Box, TextField, MenuItem
} from '@mui/material';

export default function App() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Estado para armazenar os filtros atuais
  const [filtros, setFiltros] = useState({ status: '', categoria: '', prioridade: '' });

  const fetchSolicitacoes = () => {
    setLoading(true);
    
    // Remove os filtros que estão vazios para não atrapalhar a URL
    const params = Object.fromEntries(Object.entries(filtros).filter(([_, v]) => v !== ''));

    api.get<PaginatedResponse<Solicitacao>>('/solicitacoes', { params })
      .then(response => {
        setSolicitacoes(response.data.data);
      })
      .catch(error => console.error("Erro ao buscar solicitações:", error))
      .finally(() => setLoading(false));
  };

  // Dispara a busca sempre que um filtro é alterado
  useEffect(() => {
    fetchSolicitacoes();
  }, [filtros]);

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      await api.patch(`/solicitacoes/${id}/status`, { status: novoStatus });
      fetchSolicitacoes();
    } catch (error: any) {
      console.error("Erro ao atualizar status", error);
      alert(error.response?.data?.message || "Erro ao atualizar o status.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEBIDA': return 'info';
      case 'EM_ANALISE': return 'warning';
      case 'AGENDADA': return 'primary';
      case 'CONCLUIDA': return 'success';
      case 'CANCELADA': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Gestão de Solicitações (V-Lab)
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          + Nova Solicitação
        </Button>
      </Box>

      {/* Barra de Filtros */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
        <TextField select label="Filtrar por Status" size="small" fullWidth
          value={filtros.status}
          onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="RECEBIDA">Recebida</MenuItem>
          <MenuItem value="EM_ANALISE">Em Análise</MenuItem>
          <MenuItem value="AGENDADA">Agendada</MenuItem>
          <MenuItem value="CONCLUIDA">Concluída</MenuItem>
          <MenuItem value="CANCELADA">Cancelada</MenuItem>
        </TextField>

        <TextField select label="Filtrar por Categoria" size="small" fullWidth
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="CONSULTA">Consulta</MenuItem>
          <MenuItem value="EXAME">Exame</MenuItem>
          <MenuItem value="VACINACAO">Vacinação</MenuItem>
          <MenuItem value="OUTRO">Outro</MenuItem>
        </TextField>

        <TextField select label="Filtrar por Prioridade" size="small" fullWidth
          value={filtros.prioridade}
          onChange={(e) => setFiltros({ ...filtros, prioridade: e.target.value })}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="BAIXA">Baixa</MenuItem>
          <MenuItem value="MEDIA">Média</MenuItem>
          <MenuItem value="ALTA">Alta</MenuItem>
          <MenuItem value="URGENTE">Urgente</MenuItem>
        </TextField>
        
        <Button variant="outlined" color="inherit" onClick={() => setFiltros({ status: '', categoria: '', prioridade: '' })}>
          Limpar
        </Button>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Protocolo</strong></TableCell>
              <TableCell><strong>Solicitante</strong></TableCell>
              <TableCell><strong>Categoria</strong></TableCell>
              <TableCell><strong>Prioridade</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Carregando dados da API...</TableCell>
              </TableRow>
            ) : solicitacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhuma solicitação encontrada com estes filtros.</TableCell>
              </TableRow>
            ) : (
              solicitacoes.map((solicitacao) => (
                <TableRow key={solicitacao.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{solicitacao.protocolo}</TableCell>
                  <TableCell>{solicitacao.nome_solicitante}</TableCell>
                  <TableCell>{solicitacao.categoria}</TableCell>
                  <TableCell>
                    <Chip label={solicitacao.prioridade} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={solicitacao.status} 
                      size="small" 
                      color={getStatusColor(solicitacao.status) as any} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    {solicitacao.status === 'RECEBIDA' && (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button size="small" variant="outlined" color="warning" onClick={() => handleStatusChange(solicitacao.id, 'EM_ANALISE')}>Analisar</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(solicitacao.id, 'CANCELADA')}>Cancelar</Button>
                      </Box>
                    )}
                    {solicitacao.status === 'EM_ANALISE' && (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button size="small" variant="outlined" color="primary" onClick={() => handleStatusChange(solicitacao.id, 'AGENDADA')}>Agendar</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(solicitacao.id, 'CANCELADA')}>Cancelar</Button>
                      </Box>
                    )}
                    {solicitacao.status === 'AGENDADA' && (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button size="small" variant="outlined" color="success" onClick={() => handleStatusChange(solicitacao.id, 'CONCLUIDA')}>Concluir</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(solicitacao.id, 'CANCELADA')}>Cancelar</Button>
                      </Box>
                    )}
                    {(solicitacao.status === 'CONCLUIDA' || solicitacao.status === 'CANCELADA') && (
                      <Typography variant="caption" color="textSecondary">-</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <NovaSolicitacaoDialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={fetchSolicitacoes} 
      />
    </Container>
  );
}