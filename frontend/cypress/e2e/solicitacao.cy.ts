describe('Fluxo de Criação de Solicitações', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173'); 
  });

  it('deve exigir justificativa quando a prioridade for URGENTE', () => {
    cy.contains('NOVA SOLICITAÇÃO', { matchCase: false }).click();

    // Encontra o wrapper pelo data-cy e digita no input interno
    cy.get('[data-cy="input-nome"]').find('input').type('Paciente Teste Cypress');
    
    // Clica no wrapper do Select para abrir as opções
    cy.get('[data-cy="select-categoria"]').click();
    cy.get('li[data-value="CONSULTA"]').click();
    
    cy.get('[data-cy="select-prioridade"]').click();
    cy.get('li[data-value="URGENTE"]').click();

    // Descrição usa textarea
    cy.get('[data-cy="input-descricao"]').find('textarea').first().type('Necessidade de avaliação cardiológica.');

    // Tenta salvar para forçar a validação HTML5 do campo Justificativa (que ficou em branco)
    cy.get('[data-cy="btn-salvar"]').click();

    // Como o campo de justificativa tem 'required', a interface não deve fechar e a submissão é bloqueada.
    // Pode verificar se o modal continua aberto validando se o título persiste:
    cy.contains('Nova Solicitação').should('be.visible');
  });
});