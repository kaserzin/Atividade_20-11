const state = {
    relíquias: {
        varinha: false,
        pedra: false,
        capa: false,
    },
};

let userPath = [];
const story = {
    inicio: {
        title: "A Caça às Relíquias da Morte",
        text: "Você recebeu uma carta misteriosa que fala das Relíquias da Morte. Sua busca começa em Hogwarts, mas há perigos à frente. Onde você deseja ir primeiro?",
        options: [
            { text: "Investigar a Floresta Proibida", next: "floresta" },
            { text: "Falar com Dumbledore no escritório", next: "escritorio" },
            { text: "Explorar o Beco Diagonal em busca de informações", next: "beco" },
        ],
    },
    floresta: {
        title: "Na Floresta Proibida",
        text: "Na Floresta Proibida, você encontra Aragog. Você pode ajudá-lo ou lutar contra ele.",
        options: [
            { text: "Ajudar Aragog", next: "aragog" },
            { text: "Lutar contra Aragog", next: "batalha_aragog" },
            { text: "Fugir da Floresta", next: "inicio" },
        ],
    },
    escritorio: {
        title: "O Escritório de Dumbledore",
        text: "Dumbledore revela que a Varinha das Varinhas está com Voldemort, mas ele menciona um artefato no Ministério da Magia.",
        options: [
            { text: "Ir ao Ministério da Magia", next: "ministerio" },
            { text: "Perguntar sobre a Capa da Invisibilidade", next: "capa" },
        ],
    },
    beco: {
        title: "No Beco Diagonal",
        text: "Você descobre um informante na loja do Olivaras que fala de um duelo clandestino envolvendo a Varinha das Varinhas.",
        options: [
            { text: "Participar do duelo", next: "duelo" },
            { text: "Voltar a Hogwarts", next: "inicio" },
        ],
    },
    aragog: {
        title: "Ajudando Aragog",
        text: "Aragog revela que a Pedra da Ressurreição está escondida no Salgueiro Lutador. Ele o guia até lá.",
        options: [
            { text: "Entrar no Salgueiro Lutador", next: "salgueiro" },
            { text: "Voltar para a Floresta", next: "floresta" },
        ],
    },
    batalha_aragog: {
        title: "Batalha com Aragog",
        text: "Após uma batalha feroz, você derrota Aragog, mas acaba gravemente ferido. Você deve descansar antes de continuar.",
        options: [
            { text: "Retornar a Hogwarts", next: "inicio" },
        ],
    },
    ministerio: {
        title: "Ministério da Magia",
        text: "No Ministério, você enfrenta desafios burocráticos e mágicos. No final, encontra um pergaminho sobre a localização da Pedra da Ressurreição.",
        options: [
            { text: "Seguir para o Salgueiro Lutador", next: "salgueiro" },
        ],
    },
    capa: {
        title: "A Capa da Invisibilidade",
        text: "Dumbledore revela que a Capa da Invisibilidade está com um parente de Harry Potter. Você precisa de um plano para recuperá-la.",
        options: [
            { text: "Pedir ajuda a Harry", next: "harry" },
            { text: "Roubar a capa", next: "roubo" },
        ],
    },
    duelo: {
        title: "Duelo Clandestino",
        text: "No duelo, você enfrenta o bruxo e consegue a Varinha das Varinhas após uma batalha intensa.",
        options: [
            { text: "Buscar a próxima relíquia", next: "inicio" },
        ],
        action: () => {
            state.relíquias.varinha = true;
        },
    },
    salgueiro: {
        title: "Salgueiro Lutador",
        text: "Dentro do Salgueiro Lutador, você encontra a Pedra da Ressurreição, mas um feitiço a protege. Resolva o enigma para libertá-la.",
        options: [
            { text: "Decifrar o enigma", next: "pedra_resolvida" },
        ],
    },
    pedra_resolvida: {
        title: "A Pedra da Ressurreição",
        text: "Você conseguiu a Pedra da Ressurreição! Qual será seu próximo passo?",
        options: [
            { text: "Voltar a Hogwarts", next: "inicio" },
        ],
        action: () => {
            state.relíquias.pedra = true;
        },
    },
    harry: {
        title: "Ajudando Harry",
        text: "Harry confia em você e entrega a Capa da Invisibilidade. Ela agora é sua!",
        options: [
            { text: "Voltar a Hogwarts", next: "inicio" },
        ],
        action: () => {
            state.relíquias.capa = true;
        },
    },
    roubo: {
        title: "O Roubo da Capa",
        text: "Você tenta roubar a Capa da Invisibilidade e Harry lhe mulekou, fazendo você perder todas as relíquias já conquistadas.",
        options: [
            { text: "Voltar a Hogwarts", next: "inicio" },
        ],
        action: () => {
            resetState();
        },
    },
    final: {
        title: "As Relíquias da Morte",
        text: "Você conquistou as três Relíquias da Morte! Agora você é o mestre da Morte. Mas será que isso é uma bênção ou uma maldição? O caminho que você percorreu foi: " + userPath.join(" → "),
        options: [
            { text: "Recomeçar a aventura", next: "inicio" },
        ],
        action: () => {
            resetState();
        }
    },
};

function resetState() {
    state.relíquias.varinha = false;
    state.relíquias.pedra = false;
    state.relíquias.capa = false;
    userPath = [];
}

function loadProgress() {
    return localStorage.getItem("lastStep") || "inicio";
}

function saveProgress(step) {
    localStorage.setItem("lastStep", step);
}

function renderStory(step) {
    const container = document.getElementById("story-container");
    container.innerHTML = "";

    const currentStep = story[step];
    if (!currentStep) {
        renderStory("inicio");
        return;
    }

    if (currentStep.action) {
        currentStep.action();
    }

    if (step === "inicio" && state.relíquias.varinha && state.relíquias.pedra && state.relíquias.capa) {
        renderStory("final");
        return;
    }

    const title = document.createElement("h1");
    title.innerText = currentStep.title;

    const text = document.createElement("p");
    text.innerHTML = currentStep.text;

    container.appendChild(title);
    container.appendChild(text);

    currentStep.options.forEach((option) => {
        const link = document.createElement("a");
        link.href = "#";
        link.innerText = option.text;
        link.addEventListener("click", (e) => {
            e.preventDefault();
            userPath.push(option.text); 
            saveProgress(option.next);
            renderStory(option.next);
        });
        container.appendChild(link);
    });
}

const startStep = loadProgress();
renderStory(startStep);
console.log("História iniciada");
console.log("Progresso no localStorage:", localStorage.getItem("lastStep"));
