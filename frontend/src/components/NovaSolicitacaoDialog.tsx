import { useState } from 'react';
import { api } from '../services/api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Box
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovaSolicitacaoDialog({ open, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    nome_solicitante: '',
    categoria: 'CONSULTA',
    prioridade: 'BAIXA',
    descricao: '',
    justificativa_prioridade: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Bloqueia o botão
    try {
      await api.post('/solicitacoes', formData);
      onSuccess(); 
      onClose();   
      setFormData({ nome_solicitante: '', categoria: 'CONSULTA', prioridade: 'BAIXA', descricao: '', justificativa_prioridade: '' });
    } catch (error) {
      console.error("Erro ao criar solicitação", error);
      alert("Erro ao salvar. Verifique se preencheu tudo corretamente.");
    } finally {
      setIsSubmitting(false); // Liberta o botão independentemente do resultado
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1976d2' }}>Nova Solicitação</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Nome do Solicitante" required fullWidth
              value={formData.nome_solicitante}
              onChange={(e) => setFormData({ ...formData, nome_solicitante: e.target.value })}
            />
            
            <TextField select label="Categoria" required fullWidth
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            >
              <MenuItem value="CONSULTA">Consulta</MenuItem>
              <MenuItem value="EXAME">Exame</MenuItem>
              <MenuItem value="VACINACAO">Vacinação</MenuItem>
              <MenuItem value="OUTRO">Outro</MenuItem>
            </TextField>

            <TextField select label="Prioridade" required fullWidth
              value={formData.prioridade}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
            >
              <MenuItem value="BAIXA">Baixa</MenuItem>
              <MenuItem value="MEDIA">Média</MenuItem>
              <MenuItem value="ALTA">Alta</MenuItem>
              <MenuItem value="URGENTE">Urgente</MenuItem>
            </TextField>

            <TextField label="Descrição" required fullWidth multiline rows={3}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />

            {/* Renderização Condicional: Só aparece se a prioridade for URGENTE */}
            {formData.prioridade === 'URGENTE' && (
              <TextField label="Justificativa de Prioridade" required fullWidth multiline rows={2}
                value={formData.justificativa_prioridade}
                onChange={(e) => setFormData({ ...formData, justificativa_prioridade: e.target.value })}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Solicitação'}
        </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}