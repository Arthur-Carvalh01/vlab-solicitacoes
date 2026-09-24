import { useEffect, useState } from 'react';
import { api } from './services/api';
import type { Solicitacao, PaginatedResponse } from './types';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip
} from '@mui/material';

export default function App() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados da API quando o componente é montado na tela
  useEffect(() => {
    api.get<PaginatedResponse<Solicitacao>>('/solicitacoes')
      .then(response => {
        setSolicitacoes(response.data.data);
      })
      .catch(error => {
        console.error("Erro ao buscar solicitações:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Função simples para colorir a tag de status
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Gestão de Solicitações (V-Lab)
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Protocolo</strong></TableCell>
              <TableCell><strong>Solicitante</strong></TableCell>
              <TableCell><strong>Categoria</strong></TableCell>
              <TableCell><strong>Prioridade</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Carregando dados da API...</TableCell>
              </TableRow>
            ) : solicitacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Nenhuma solicitação encontrada no banco de dados.</TableCell>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}