# Guia Completo da Estratégia de Git Flow

---

Este documento descreve o fluxo de trabalho Git Flow que adotamos para o desenvolvimento de nossas aplicações. Seguir este guia é fundamental para mantermos a organização, a qualidade do código e a estabilidade das nossas branches principais.



## Como Funciona: As Branches

    Nosso fluxo se baseia em duas branches principais de longa duração e duas branches de suporte, que são temporárias.



### Branches principais (Permanentes)

1. `main`
   
   - **Propósito:** Representa o código que está em **produção**. Esta é a nossa fonte de verdade estável e pronta para deploy.
   
   - **Regras:**
     
     - O código na `main` deve ser sempre compilável, testado e estável.
     
     - **Ninguém** faz push direto para a `main`. As alterações só chegam via Pull Requests da branch `develop`.
     
     - Cada commit na `main` é criado uma imagem docker estável da aplicação, pronta para ser feito o deploy.

2. `develop`
   
   - **Propósito:** É a nossa branch de **integração** principal. Representa o estado mais recente do desenvolvimento e deve estar **sempre em um estado "pronto para ir para produção"**.
   
   - **Regras:** 
     
     - Esta branch é o destino de todas as branches de `feature`.
     
     - **Ninguém** faz push direto para a `develop`. As alterações só chegam via Pull Requests.
     
     - O código aqui deve sempre compilar e passar em todos os testes. Todas as features mescladas devem estar completas.

### Branches de Suporte (Temporárias)

1. `features/*` (ex: `feature/login-usuario`, `feature/novo-relatorio`)
   
   - **Propósito:** Desenvolver novas funcionalidades de forma isolada.
   
   - **Fluxo:**
     
     - Criada a partir da `develop`.
     
     - Ao ser concluída, é mesclada de volta na `develop` através de um Pull Request.
     
     - Nunca interage diretamente com a `main`.

2. `hotfix/*` (ex: `hotfix/correcao-bug-agendamento`)
   
   - **Propósito:** Corrigir um bug crítico que foi encontrado em produção.
   
   - **Fluxo:**
     
     - Criada a partir da `main`.
     
     - Permite corrigir o problema de forma isolada, sem trazer junto funcionalidade da `develop`.
     
     - Após a correção, ela é mesclada em **duas** branches:
       
       1. Na `main` (para corrigir a produção imediatamente).
       
       2. De volta na `develop` (para garantir que a correção do bug seja incorporada no próximo ciclo de desenvolvimento).

## Como Utilizar: Fluxos de Trabalho no Dia a Dia

    Siga estes passos para as tarefas mais comuns.

### Cenário 1: Desenvolvendo uma Nova Funcionalidade

    Vamos simular a criação dea funcionalidade de login.

1. **Sincronize e parta da `develop`:**
   
   ```git
   git checkout develop # Altera para a branch develop
   git pull origin develop # Sincroniza a branch develop remota com a local
   ```

2. **Crie sua feature branch:**
   
   ```git
   # Use um nome claro e descritivo
   git checkout -b feature/login-do-usuario
   ```

3. **Trabalhe e faça seus commits:**
   Faça seu trabalho, criando commits pequenos e atômicos.
   
   ```git
   git add .
   git commit -m "feat: criar endpoint de login"
   ```

4. **Envia sua branch para o repositório remoto:**
   
   ```git
   git push -u origin feature/login-do-usuario
   ```

5. **Abra um Pull Request (PR):**
   
   No GitHub, abra um Pull Request da sua branch `feature/login-do-usuario` para a branch `develop`. Descreva as alterações e marque os revisores. Após a aprovação e o merge, sua funcionalidade estará integrada e pronta para o próximo lançamento.

### Cenário 2: Preparando para um Novo Lançamento (Deploy)

    Quando o branch `develop` contém todas as features e correções que você deseja lançar:

1.  Abra um Pull Request da `develop` para a `main`.

2.  Uma vez que o PR for aprovado, ele é **mesclado** na `main`.

3.  Este merge na `main` é o gatilho para ser gerado uma imagem docker estável da aplicação, pronta para ser utilizada pela equipe de frontend ou ser feito o deploy.

### Cenário 3: Resolvendo Conflito de Commits

    Aqui está o passo a passo detalhado e seguro para fazer isso.

#### Cenário Típico

- Você criou sua branch `feature/minha-feature` a partir da `develop`.

- Enquanto você trabalhava, outro desenvolvedor mesclou a `feature/dele` na `develop`.

- Agora, a `develop` no GitHub está à frente da sua branch.

- Quando você abre um Pull Request (PR) de `feature/minha-feature` para `develop`, o GitHub acusa um conflito de merge.

#### Passo a Passo Detalhado para a Resolução

    Siga estes passos na sua máquina local.

##### Passo 1: Prepare sua Feature na Branch Local

    Garanta que você esteja na sua branch de trabalho e que ela esteja sincronizada com a versão remota.  

```git
# 1. Vá para a sua branch de feature
git checkout feature/minha-feature

# 2. Garanta que ela esteja atualizada com o seu remoto
git pull origin feature/minha-feature    
```

##### Passo 2: Puxe as Atualizações da `develop` para a sua Feature Branch

    Este é o passo crucial. Você vai "puxar" o estado mais recente da `develop` dentro da sua branch `feature/minha-feature`.

```git
git pull origin develop    
```

    É neste momento que o Git tentará mesclar as duas branches e, se houver conflitos, ele avisará você no terminal. A mensagem será parecida com esta:

```git
    Auto-merging [caminho/do/arquivo/conflitante]
    CONFLICT (content): Merge conflict in [caminho/do/arquivo/conflitante]
    Automatic merge failed; fix conflicts and then commit the result.
```

    Sua branch agora está em um estado de "merging".

##### Passo 3: resolva os Conflitos no seu Editor de Código

    A melhor forma de resolver conflitos é usando uma ferramenta visual como o VS Code.

1.  Abra o projeto no seu editor. Os arquivos com conflitos estarão marcados em vvermelho ou com um "C"

2.  Abra o arquivo conflitante. Você verá as seções problemáticas destacadas com os marcadores do Git:
   
   ```git
   <<<<<<< HEAD
   // O seu código (da sua feature branch) está aqui.
   =======
   // O código que veio da develop está aqui.
   >>>>>>> branch 'develop' of ...
   ```

    **OBS: Contate o dev responsável pelas alterações no código, para vocês debaterem qual trecho de código deve ser mantido e qual descartado.**

- O VS Code (e outras IDEs) mostrará botões de ação acima do bloco de conflito:
  
  - `Accept Current Change`: Manter **apenas** o seu código.
  
  - `Accept Incoming Change`: Manter **apenas** o código que veio da `develop`.
  
  - `Accept Both Changes`: Manter **ambos** os trechos de código (um depois do outro).
  
  - `Compare Changes`: Ver as diferenças lado a lado.

- **Salve o Arquivo** após resolver todos os conflitos dentro dele.

##### Passo 4: Finalize o Merge Localmente

    Depois de resolver os conflitos em todos os arquivos, você precisa finalizar o processo de merge.

1. **Adicione os arquivos resolvidos ao "stage"**: Isso sinaliza ao Git que você terminou de resolver os conflitos
   
   ```git
   git add .
   ```

2. **Faça o commit**:
   
   ```git
   git commit -m "fix: corrigido o conflito com a branch develop"
   ```

    Neste ponto, sua branch `feature/minha-feature` local contém o seu trabalho **e** as últimas atualizações da `develop`, com todos os conflitos resolvidos.

##### Passo 5: Atualize seu Pull Request

    O passo final é enviar sua branch corrigida de volta para o GitHub.

```git
git push origin feature/minha-feature    
```

    Este push enviará o seu commit de resolução para o GitHub. A interface do Pull Request será atualizada automaticamente e a mensagem de conflito deve desaparecer, mostrando que agora o merge pode ser feito sem problemas.

## Boas Práticas

- **🔄 Atualie com Frequência:** Execute `git pull origin develop` na sua feature branch regularmente (uma vez por dia, por exemplo). Isso traz mudanças dos seus colegas em pequenas partes, tornando os conflitos menores e mais fáceis de resolver.

- **📤 Commits Pequenos e Focados:** Crie branches e Pull Requests para tarefas pequenas e bem definidas. Quanto menor a alteração, menor a chance de conflito.

- **🗣 Comunicação:** Converse com sua equipe sobre em quais partes do código cada um está trabalhando

- **🚫 Nunca Faça Push Direto para `main` ou `develop`:** Todas as alterações devem passar por um Pull Request. Nossas regras de proteção de branch já forçam isso. 

- **🔎 Code Review é Obrigatório:** Todo PR para a `develop`deve ser revisado e aprovado por pelo menos um outro membro da equipe.

- **🗑 Delete Branches Após o Merge:** Após seu PR ser aprovado e mesclado, delete sua branch de feature tanto no remoto quanto localmente para manter o repositório limpo.
