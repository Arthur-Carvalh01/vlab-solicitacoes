import React, { useState, type FormEvent } from 'react';
import { api } from '../services/api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Box, Alert
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const estadoInicial = {
  nome_solicitante: '',
  categoria: 'CONSULTA',
  prioridade: 'BAIXA',
  descricao: '',
  justificativa_prioridade: ''
};

export default function NovaSolicitacaoDialog({ open, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState(estadoInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); 

    try {
      await api.post('/solicitacoes', formData);
      onSuccess();
      
      // Reseta o estado ANTES de fechar o modal
      setFormData(estadoInicial); 
      onClose();   
    } catch (error: any) {
      console.error("Erro ao criar solicitação", error);
      const mensagemBackend = error.response?.data?.message || "Erro ao salvar. Verifique se preencheu tudo corretamente.";
      setErrorMessage(mensagemBackend);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Garante que o estado seja limpo mesmo se o usuário fechar clicando fora ou no botão Cancelar
  const handleClose = () => {
    setFormData(estadoInicial);
    setErrorMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1976d2' }}>Nova Solicitação</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            
            {errorMessage && (
              <Alert severity="error" data-cy="alerta-erro">{errorMessage}</Alert>
            )}

            <TextField 
              label="Nome do Solicitante" 
              required 
              fullWidth 
              value={formData.nome_solicitante}
              onChange={(e) => setFormData({ ...formData, nome_solicitante: e.target.value })}
              data-cy="input-nome"
            />
            
            <TextField 
              select 
              label="Categoria" 
              required 
              fullWidth
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              data-cy="select-categoria"
            >
              <MenuItem value="CONSULTA">Consulta</MenuItem>
              <MenuItem value="EXAME">Exame</MenuItem>
              <MenuItem value="VACINACAO">Vacinação</MenuItem>
              <MenuItem value="OUTRO">Outro</MenuItem>
            </TextField>

            <TextField 
              select 
              label="Prioridade" 
              required 
              fullWidth
              value={formData.prioridade}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
              data-cy="select-prioridade"
            >
              <MenuItem value="BAIXA">Baixa</MenuItem>
              <MenuItem value="MEDIA">Média</MenuItem>
              <MenuItem value="ALTA">Alta</MenuItem>
              <MenuItem value="URGENTE">Urgente</MenuItem>
            </TextField>

            <TextField 
              label="Descrição" 
              required 
              fullWidth 
              multiline 
              rows={3}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              data-cy="input-descricao"
            />

            {formData.prioridade === 'URGENTE' && (
              <TextField 
                label="Justificativa de Prioridade" 
                required 
                fullWidth 
                multiline 
                rows={2}
                value={formData.justificativa_prioridade}
                onChange={(e) => setFormData({ ...formData, justificativa_prioridade: e.target.value })}
                data-cy="input-justificativa"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} data-cy="btn-salvar">
            {isSubmitting ? 'Salvando...' : 'Salvar Solicitação'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}